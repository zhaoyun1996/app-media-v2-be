const express = require("express");
const ZingMp3 = require("zingmp3-api-full");
const cors = require("cors");

const app = express();
app.use(cors());

//#region Viết code vào đây

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

// //here we are configuring dist to serve app files
// app.use("/", serveStatic(path.join(__dirname, "/dist")));

// // this * route is to serve project on different page routes except root `/`
// app.get(/.*/, function (req, res) {
//     res.sendFile(path.join(__dirname, "/dist/index.html"));
// });

const port = process.env.PORT || 3002;
app.listen(port);
console.log(`app is listening on port: ${port}`);
