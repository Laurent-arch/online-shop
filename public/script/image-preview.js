const imagePicker = document.querySelector('.image-upload-preview input');
const imagePreview = document.querySelector(".image-upload-preview img");

const updateImagePreview = () => {
    const files = imagePicker.files;

    if(!files || files.length ===0) {
        imagePreview.style.display = 'none'
        return;
    }
    const pickedFile = files[0];

    imagePreview.src = URL.createObjectURL(pickedFile)
    imagePreview.style.display = 'block'
}

imagePicker.addEventListener('change', updateImagePreview)