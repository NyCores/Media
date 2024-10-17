document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        // Read the file as text
        const reader = new FileReader();
        reader.onload = async function (event) {
            const fileContent = event.target.result;

            // Call the function to upload to GitHub
            await uploadFileToGitHub(file.name, fileContent);
        };

        reader.readAsText(file);
    } else {
        alert('Please select a file to upload.');
    }
});

async function uploadFileToGitHub(fileName, fileContent) {
    const githubToken = 'YOUR_PERSONAL_ACCESS_TOKEN';  // Replace with your GitHub PAT
    const repoOwner = 'YOUR_GITHUB_USERNAME';  // Replace with your GitHub username
    const repoName = 'YOUR_REPOSITORY_NAME';  // Replace with your GitHub repository name
    const filePath = `media file/${fileName}`;  // File path in the "media file" folder

    // Convert file content to Base64 format (GitHub requires this)
    const base64Content = btoa(fileContent);

    // API URL to upload the file
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // API request payload
    const payload = {
        message: `Adding ${fileName}`,  // Commit message
        content: base64Content,         // Base64 encoded file content
    };

    try {
        // Make the API request to upload the file
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
