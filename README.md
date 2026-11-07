# Online Code Playground Using Docker and GitHub Actions CI/CD

An in-browser code playground where you write **HTML, CSS and JavaScript** in three separate editors and instantly see the result in a live preview. The website is served by **Nginx inside a Docker container**, its source code lives on **GitHub**, and a **GitHub Actions** pipeline automatically builds the Docker image and publishes it to **Docker Hub**.

## Objectives

- Build a simple, professional online code playground using only HTML, CSS and JavaScript.
- Containerize the website with Docker and serve it with Nginx.
- Store the source code in a GitHub repository.
- Automate building and publishing the Docker image with GitHub Actions (CI/CD).
- Publish the image to Docker Hub so anyone can run it with one command.

## Features

- Three separate editors: HTML, CSS and JavaScript, each with a Clear button.
- **Run** button combines the code and shows the result in a sandboxed iframe.
- **Reset** button clears all editors and the preview.
- **Load Sample** button fills the editors with working example code and runs it.
- JavaScript runtime errors from your code are shown below the preview.
- Keyboard shortcuts: `Ctrl + Enter` runs the code, `Tab` inserts two spaces.
- Dark developer-style interface, responsive on desktop, laptop and mobile.
- User code runs in an iframe with `sandbox="allow-scripts allow-modals allow-forms"` and without `allow-same-origin`, so it cannot access the main page.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML | Website structure |
| CSS | Website styling |
| JavaScript | Code execution and interaction |
| Nginx | Serving the static website files |
| Docker | Containerizing the website |
| GitHub | Source-code repository |
| GitHub Actions | CI/CD automation |
| Docker Hub | Storing the published Docker image |

## Project Folder Structure

```
online-code-playground/
├── index.html
├── style.css
├── script.js
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
└── .github/
    └── workflows/
        └── docker-build.yml
```

## How to Run Without Docker

No server is needed. Open the project folder and double-click `index.html`, or in VS Code right-click `index.html` and choose **Open with Live Server** (if you have that extension).

## How to Build the Docker Image

Run in the VS Code terminal, inside the project folder (Docker Desktop must be running):

```bash
docker build -t online-code-playground .
```

## How to Run the Docker Container

```bash
docker run -d -p 8080:80 --name code-playground online-code-playground
```

Open **http://localhost:8080** in your browser. Check the container with:

```bash
docker ps
```

## How to Stop and Remove the Container

```bash
docker stop code-playground
docker rm code-playground
```

### Rebuild after changing the website

If you edit the code, remove the old container first, otherwise the name `code-playground` is already taken:

```bash
docker stop code-playground
docker rm code-playground
docker build -t online-code-playground .
docker run -d -p 8080:80 --name code-playground online-code-playground
```

One-line version (the `-f` flag removes the container even if it is running, and it is safe if it does not exist):

```bash
docker rm -f code-playground
```

## GitHub Setup

Replace `YOUR_GITHUB_USERNAME` with your own username. First create an empty repository named `online-code-playground` on github.com (no README, no .gitignore).

```bash
git init
git add .
git commit -m "Initial commit: Online Code Playground"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/online-code-playground.git
git push -u origin main
```

## Docker Hub Setup

1. Create a free account at https://hub.docker.com.
2. Click **Create repository**, name it `online-code-playground`, set visibility to **Public**, and create it.
3. Go to **Account Settings -> Personal access tokens -> Generate new token**. Give it **Read & Write** access and copy the token (it is shown only once).

## GitHub Actions CI/CD Explanation

The workflow file `.github/workflows/docker-build.yml` runs automatically on every push to the `main` branch (and can also be started manually from the Actions tab). It performs these steps:

1. **Check out repository** - downloads your code onto the runner.
2. **Set up Docker Buildx** - prepares the Docker build tool.
3. **Log in to Docker Hub** - uses the repository secrets.
4. **Build and push image** - builds the image from the `Dockerfile` and pushes `YOUR_DOCKERHUB_USERNAME/online-code-playground:latest` to Docker Hub.

### Required Repository Secrets

On GitHub open your repository, then **Settings -> Secrets and variables -> Actions -> New repository secret** and add:

| Secret name | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub **access token** (not your normal password) |

Add both secrets **before** pushing, otherwise the first workflow run will fail at the login step.

### Pull and run the published image

```bash
docker pull YOUR_DOCKERHUB_USERNAME/online-code-playground:latest
docker run -d -p 8080:80 --name code-playground YOUR_DOCKERHUB_USERNAME/online-code-playground:latest
```

If the website opens at http://localhost:8080, the published image works. Remove any older container named `code-playground` first (`docker rm -f code-playground`).

## Testing Instructions

**Website (browser):**

1. Click **Load Sample** - the output shows a card with a button; click the button and the counter and colour change.
2. Click **Reset** - all editors and the preview are cleared.
3. Type `<h1>Hi</h1>` in HTML, `h1 { color: red; }` in CSS, and `document.querySelector('h1').textContent = 'Changed';` in JavaScript, then click **Run** - a red heading reading "Changed" appears.
4. Type `nonexistent();` in JavaScript and click **Run** - a red error message appears below the preview.
5. Resize the browser window narrow - the layout stacks into one column without overlap.
6. Open the browser DevTools console (F12) - there should be no errors from the page itself.

**Docker:**

1. `docker build -t online-code-playground .` finishes without errors.
2. `docker run -d -p 8080:80 --name code-playground online-code-playground` starts the container.
3. `docker ps` shows `code-playground` with status `Up` (and `healthy` after a few seconds).
4. http://localhost:8080 shows the playground and every test above works.
5. `docker stop code-playground` then `docker start code-playground` brings it back.

**CI/CD:**

1. Push to `main` and open the **Actions** tab - the workflow shows a green check.
2. Docker Hub shows the `latest` tag under your `online-code-playground` repository.
3. `docker pull` and `docker run` of the published image work.

## Screenshot Checklist

1. Playground homepage (empty editors, buttons and title visible).
2. All three editors (HTML, CSS, JavaScript) with their labels.
3. Sample code entered in the editors (click Load Sample).
4. Output preview after clicking Run.
5. Terminal showing `docker build` finished successfully.
6. Terminal showing `docker ps` with `code-playground` running.
7. Browser showing `localhost:8080` with the address bar visible.
8. GitHub repository page showing all project files.
9. GitHub Actions run with a green check and the completed steps.
10. Docker Hub repository page showing the `latest` tag.
11. Terminal showing `docker pull YOUR_DOCKERHUB_USERNAME/online-code-playground:latest`.
12. Browser showing the app running from the pulled Docker Hub image.
