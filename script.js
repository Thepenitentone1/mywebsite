//Calling all the elements we need

const form = document.querySelector("form"),
    fileChooserBtn = document.querySelector(".file-chooser"),
    fileChooser = fileChooserBtn.querySelector("input"),
    feedback = document.querySelector(".feedback"),
    link = document.querySelector(".link"),
    shareButton = document.querySelector(".share-button"),
    chosenFiles = document.querySelector(".chosen-files");

form.onsubmit = (e) => {
    e.preventDefault();
}

//Uploading Images Online
shareButton.onclick = () => {
    var xml = new XMLHttpRequest();

    xml.open("POST", "php/uploads.php", true);

    xml.onload = () => {
        if (xml.readyState == XMLHttpRequest.DONE) {
            //check if it returned errors
            if (xml.status == 200) {
                hangleResults(xml.responseText).then((value) => {
                    //if request is resolved

                    if (value[0].response == "success") {
                        link.innerHTML = createLink(value[0].link)
                        feedback.innerHTML = "Link is successfully sent";
                    }
                }).catch((error) => {
                    //If request is rejected
                    feedback.innerHTML = error;
                    
                })
            } else {
                if (classList.contains("info")) {
                    classList.remove("info");
                }

                classList.add("error");
                feedback.innerHTML = error;
            }
        }
    }

    //Lets listen to it when it uploads our files
    xml.upload.onprogress = ({ loaded, total }) => {
        //showing progress

        //Show progress in percentages
        let percentages = (loaded / total) * 100;

        //Let us replace the text 'Share' in share button and replace it with 'uploading... 25%
        shareButton.innerHTML = "Uploading... " + percentages.toFixed(0) + "%";

        if (percentages != 100) {
            //Unclickable
            shareButton.style.pointerEvents = "none";
        } else {
            shareButton.style.pointerEvents = "auto";
            shareButton.innerHTML = "Share";
            chosenFiles.innerHTML = "";
        }
    }

    //Lets grab form data

    var formData = new FormData(form);
    xml.send(formData);
}

fileChooserBtn.onclick = () => {
    fileChooser.click(); //triggers the input[type == file];
}

fileChooser.onchange = ({ target }) => {
    fileChooser.innerHTML = "";
    let files = target.files;

    for (let index = 0; index < files.length; index++) {
        const element = files[index];

        let name = element.name;
        let size = element.size;

        //ensure that there is no overflow of text
        //convert bytes to Kilobytes || Megabytes

        //append Cards

        if (isPDF(name)) {
            chosenFiles.insertAdjacentHTML("afterbegin", pdfCard(rectifyName(name), hangleSize(size)))
        } else {
            chosenFiles.insertAdjacentHTML("afterbegin", imageCard(rectifyName(name), hangleSize(size)))
        }
    }
}

function hangleResults(result) {
    return new Promise((resolve, reject) => {

        let classList = feedback.classList;

        try {
            var val = JSON.parse(result);
            resolve(val);

            if (classList.contains("error")) {
                classList.remove("error");
            }

            classList.add("info");

        } catch (error) {
            //If The text returned is not an object/Json format 
            reject(result)

            if (classList.contains("info")) {
                classList.remove("info");
            }

            classList.add("error");
        }
    })
}

function hangleSize(size) {
    if ((size / 1000) < 1024) {
        //Kilobytes
        return (size / 1000).toFixed(0) + "KB";
    } else {
        //Megabytes
        return ((size / (1024 * 1024)).toFixed(0)) + "MB";
    }
}

function rectifyName(name) {
    let length = name.length;

    
    let res = name;
    if (length > 30) {
        s = name.substr(0, 30);
        ss = s + "... " + name.substr(name.lastIndexOf("."));
        res = ss;
    }
    return res;
}

function isPDF(name) {
    return name.endsWith(".pdf");
}

function createLink(link) {
    return ` 
    <i class="far fa-copy" onclick = "copy('.link-shared')"></i>
    <a class="link-shared" href="${link}" editableContent=true>${link}</a>`;
}


function imageCard(name, size) {
    return `
     <div class="card">
        <span class="avatar image">
            <i class="fas fa-image"></i>
        </span>
        <div class="details">
            <span class="name">${name}</span>
            <span class="size">File Size - ${size}</span>
        </div>
</div>`;
}

function pdfCard(name, size) {
    return `
     <div class="card">
        <span class="avatar">
            <i class="fas fa-file-pdf"></i>
        </span>
        <div class="details">
            <span class="name">${name}</span>
            <span class="size">File Size - ${size}</span>
        </div>
</div>`;
}