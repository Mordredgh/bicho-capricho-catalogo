FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html admin.html catalogo.js supabase-config.js styles.css sw.js manifest.json robots.txt /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
