const receiveFile = () => {
    const id = document.getElementById('id').value;

    const formData = new FormData();
    formData.append('id', id);

    // Get file id using XMLHttpRequest
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:3004/tutorials/'+id, true);
    xhr.send(formData);

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText);

            let blob1 = new Blob([new Uint8Array(response.data.data)],{type:'application/pdf'})

            let blobUrl = URL.createObjectURL(blob1);

            let link = document.createElement('a');

            if('download' in link){
                link.type = 'download'
                link.href = blobUrl
                link.download = response.filename
                link.click()
             }
        }
    }
}