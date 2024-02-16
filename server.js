require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Sử dụng để phát nhạc
const { ZingMp3 } = require("zingmp3-api-full");

// Sử dụng để upload ảnh
const {
    cloudinaryUpload,
    getImages,
    deleteImagesById
} = require("./services/cloudinaryServices");

const { formatBuffer } = require("./services/datauriServices");
const { singleUploadCtrl } = require("./services/mutlerServices");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//#region Music

/**
 * Thực hiện lấy bài hát
 * Get Song
 */
app.get("/getSong", async (req, res) => {
    var data = await ZingMp3.getSong(req.query.id);
    res.status(200).send(data);
});

/**
 * Thực hiện lấy chi tiết các danh sách
 * Get Detail Playlist
 */
app.get("/getDetailPlaylist", async (req, res) => {
    var data = await ZingMp3.getDetailPlaylist(req.query.id);
    res.send(data);
});

/**
 * Thực hiện lấy bài hát ở trang chủ
 * Get Home
 */
app.get("/getHome", async (req, res) => {
    var data = await ZingMp3.getHome(req.query.id);
    res.send(data);
});

/**
 * Thực hiện lấy top 100
 * Get Top 100
 */
app.get("/getTop100", async (req, res) => {
    var data = await ZingMp3.getTop100();
    res.send(data);
});

/**
 * Thực hiện lấy bảng xếp hạng
 * Get Chart Home
 */
app.get("/getChartHome", async (req, res) => {
    var data = await ZingMp3.getChartHome();
    res.send(data);
});

/**
 * Thực hiện lấy bảng xếp hạng mới nhất
 * Get New Release Chart
 */
app.get("/getNewReleaseChart", async (req, res) => {
    var data = await ZingMp3.getNewReleaseChart();
    res.send(data);
});

/**
 * Thực hiện lấy thông tin bài hát
 * Get Song Info
 */
app.get("/getInfoSong", async (req, res) => {
    var data = await ZingMp3.getInfoSong(req.query.id);
    res.send(data);
});

/**
 * Thực hiện lấy thông tin ca sĩ
 * Get Artist
 */
app.get("/getArtist", async (req, res) => {
    var data = await ZingMp3.getArtist(req.query.artistsNames);
    res.send(data);
});

/**
 * Thực hiện lấy lời bài hát
 * Get Lyric Song
 */
app.get("/getLyric", async (req, res) => {
    var data = await ZingMp3.getLyric(req.query.id);
    res.send(data);
});

/**
 * Thực hiện tìm kiếm bài hát
 * Search Song
 */
app.get("/search", async (req, res) => {
    var data = await ZingMp3.search(req.query.searchValue);
    res.send(data);
});

/**
 * Thực hiện lấy danh sách MV
 * Get List MV
 */
app.get("/getListMV", async (req, res) => {
    var data = await ZingMp3.getListMV("IWZ9Z08I", "1", "15");
    res.status(200).send(data);
});

/**
 * Thực hiện lấy danh mục MV
 * Get Category MV
 */
app.get("/getCategoryMV", async (req, res) => {
    var data = await ZingMp3.getCategoryMV("IWZ9Z08I");
    res.status(200).send(data);
});

/**
 * Thực hiện lấy video MV
 * Get Video MV
 */
app.get("/getVideo", async (req, res) => {
    var data = await ZingMp3.getVideo("ZWEW9WI8");
    res.status(200).send(data);
});

//#endregion

//#region Image

/**
 * Get Images API
 */
app.get("/api/photos", async (req, res) => {
    const response = await getImages(req.query.next_cursor || "", req.query.folder_name);
    const results = {
        images: [],
        next_cursor: null,
    };

    response.resources.forEach((item) => {
        results.images.push({
            public_id: item.public_id,
            created_at: item.created_at,
            secure_url: item.secure_url,
            width: process.env.HEIGHT_IMAGE * item.aspect_ratio + "px",
            height: process.env.HEIGHT_IMAGE + "px",
        });
    });
    if (response.next_cursor) {
        results.next_cursor = response.next_cursor;
    }

    return res.json({
        results,
    });
});

/**
 * Upload API
 */
app.post("/api/upload", singleUploadCtrl, async (req, res) => {
    const uploadFile = req.body.file || req.file;
    const folderName = req.query.folder_name;
    const fileName = req.query.file_name;
    try {
        if (!uploadFile) {
            return res.status(422).send({
                message: "There is error when uploading",
            });
        }
        let uploadResult;
        if (!uploadFile.buffer) {
            uploadResult = await cloudinaryUpload(uploadFile, folderName, fileName);
        } else {
            const file64 = formatBuffer(req.file);
            uploadResult = await cloudinaryUpload(file64.content, folderName, fileName);
        }

        // Convert stream to base64 format
        return res.json({
            cloudinaryId: uploadResult.public_id,
            url: uploadResult.secure_url,
            message: "Upload OK!",
        });
    } catch (error) {
        return res.status(422).send({
            message: error.message,
        });
    }
});

/**
 * Delete Image API
 */
app.delete("/api/delete_photos_by_id", async (req, res) => {
    const response = await deleteImagesById(req.body.public_ids);

    return res.json({
        response
    });
});

//#endregion

const port = process.env.PORT || 3002;
const server = app.listen(port);
console.log(`app is listening on port: ${port}`);

//#region Socket

const socket = require("socket.io");
const io = socket(server, {
    cors: {credentials: true},
});

let messages = [];
let users = [];

io.on("connection", function (socket) {
    socket.emit('init-chat', messages);
    socket.emit('update-users', [...users]);

    socket.on("send-msg", function (data) {
        var newMessage = { text: data.message, user: data.user, date: new Date() };
        messages.push(newMessage);
        io.emit('read-msg', newMessage);
    });

    socket.on('add-user', (user) => {
        users.push({ id: socket.id, name: user });
        io.emit('update-users', [...users]);
    });

    socket.on('disconnect', () => {
        users =  users.filter(user => user.id != socket.id);
        io.emit('update-users', [...users]);
    });
});

//#endregion