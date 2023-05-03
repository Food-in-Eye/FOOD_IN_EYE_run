# Use an official Nginx runtime as a parent image
FROM nginx:1.21-alpine

# Remove the default configuration file
# RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf

# Copy the custom Nginx configuration file to the container
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the host
EXPOSE 80