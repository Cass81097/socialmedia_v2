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


export default function uploadImages(e, callback, setIsImageLoading) {
    setIsImageLoading(true);

    const input = e.target;
    if (input.files && input.files.length > 0) {
        const files = Array.from(input.files);
        const uploadPromises = files.map((file) => {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            const contentType = metadata[fileExtension];

            const storageRef = ref(storage, 'images/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file, { contentType });

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`Upload progress for ${file.name}: ${progress}%`);
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                resolve(downloadURL);
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                );
            });
        });

        Promise.all(uploadPromises)
            .then((downloadURLs) => {
                callback(downloadURLs);
            })
            .catch((error) => {
                console.error("Error uploading files:", error);
            })
            .finally(() => {
                setIsImageLoading(false);
            });
    }
}

window.uploadImages = uploadImages;