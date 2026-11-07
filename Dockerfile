# Lightweight official Nginx image
FROM nginx:alpine

# Copy the website files into the Nginx web root
COPY index.html style.css script.js /usr/share/nginx/html/

# Nginx serves the site on port 80
EXPOSE 80

# Lets "docker ps" show (healthy) once the site responds
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

# The official Nginx image already starts Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
