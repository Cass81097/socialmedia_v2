import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxG2vMNkqz1sf4UGAaMzcaq3lVdAN5C8M",
    authDomain: "users-8f542.firebaseapp.com",
    projectId: "users-8f542",
    storageBucket: "users-8f542.appspot.com",
    messagingSenderId: "351740883393",
    appId: "1:351740883393:web:b9c6a3bba9f040cf3ebf40",
    measurementId: "G-KN5Q9HHHL7"
};

initializeApp(firebaseConfig);

const storage = getStorage();

// Create the file metadata
/** @type {any} */
const metadata = {
    'jpg': 'images/jpg',
    'jpeg': 'images/jpeg',
    'png': 'images/png'
};


export default function uploadImage(e, callback) {

    var input = e.target;
    if (input.files && input.files[0]) {
        var fileName = input.files[0].name;
        document.getElementById("file-name").textContent = fileName;
    }

    document.getElementById("image-upload").disabled = true;
    let file = e.target.files[0];

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    document.getElementById("upload-progress").hidden = false;

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let progressBar = document.getElementById("upload-progress");
            let progressImg = document.querySelector(".progress");
            progressBar.style.width = Math.round(progress) + "%";
            progressBar.innerHTML = Math.round(progress) + "%";
            progressImg.style.margin = "0px 0px 10px 0px";
            var divElement = document.querySelector(".image-url");
            divElement.removeAttribute("hidden");
            const inputElement = document.getElementById("image");

            if (inputElement !== null) {
                inputElement.readOnly = true;
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case "storage/unauthorized":
                    // User doesn't have permission to access the object
                    break;
                case "storage/canceled":
                    // User canceled the upload
                    break;

                // ...

                case "storage/unknown":
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
                document.getElementById("image-url").src = downloadURL;
                setTimeout(() => {
                    document.getElementById("image-upload").disabled = false;
                }, 500);
                // Gọi callback và truyền đường dẫn tải xuống làm đối số
                callback(downloadURL);
            });
        }
    );
}

window.uploadImage = uploadImage;
