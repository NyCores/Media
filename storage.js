document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        // Read the file content as text or base64
        const reader = new FileReader();
        reader.onload = async function (event) {
            const fileContent = event.target.result;

            // Call the function to upload the file to GitHub
            await uploadFileToGitHub(file.name, fileContent);
        };

        reader.readAsText(file);  // You can also use `readAsDataURL` for non-text files
    } else {
        alert('Please select a file to upload.');
    }
});

async function uploadFileToGitHub(fileName, fileContent) {
    const githubToken = 'ghp_bd6KpOtvJsP×U2FmBgwKkcv5wZF22A1jxU1G';  // Replace with your GitHub PAT
    const repoOwner = 'NyCores';  // GitHub Username
    const repoName = 'Media';  // GitHub Repository Name
    const filePath = `media file/${fileName}`;  // Path to save in "media file" folder

    // Convert file content to Base64 format as required by GitHub
    const base64Content = btoa(fileContent);

    // GitHub API URL to upload the file
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Payload for the API request
    const payload = {
        message: `Add ${fileName}`,  // Commit message for uploading the file
        content: base64Content,      // Base64 encoded file content
    };

    try {
        // Send the PUT request to GitHub API to upload the file
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('output').innerText = `File uploaded: ${result.content.name}`;
        } else {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        document.getElementById('output').innerText = 'File upload failed.';
    }
}
