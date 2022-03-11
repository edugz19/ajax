import "regenerator-runtime/runtime";
import axios from "axios";

let imgUrl =
    "https://i2.wp.com/ceklog.kindel.com/wp-content/uploads/2013/02/firefox_2018-07-10_07-50-11.png?fit=641%C618&ssl=1";
let baseUrl = "https://test-node-server-n86p3o8hk-pffranco.vercel.app";
let content = document.querySelector(".content");
let form = document.getElementById("form");
let btn = document.getElementById("btn");
let inputFile = document.getElementById("file");
let inputFileUpload = document.getElementById("upload");

const addTextToContent = (text) => {
    content.innerHTML = text;
};

const addElementToContent = (node) => {
    content.appendChild(node);
};

// const parseHtml = (text) => {
//     const parser = new DOMParser();
//     return parser.parseFromString(text, "text/html");
// };

const createImageFromBlob = (blob) => {
    content.innerHTML = "";
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
};

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    axios.post(`${baseUrl}/save`, data, { cancelToken: source.token })
        .catch((ex) => {
        if (axios.isCancel(ex)) {
            console.log("Request cancelled", ex.message);
        }
    });

    source.cancel("Canceled by user");
});

btn.addEventListener("click", (ev) => {
    axios
        .get(imgUrl, { responseType: "blob" })
        .then((res) => res.data)
        .then(createImageFromBlob)
        .then(addElementToContent);
});

inputFileUpload.addEventListener("click", function (ev) {
    const files = inputFile.files;
    const data = new FormData();
    data.append("image", files[0]);
    axios
        .post(`${baseUrl}/file`, data)
        .then((res) => res.data.name)
        .then(addTextToContent);
});
