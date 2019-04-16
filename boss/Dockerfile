FROM alinode:boss
WORKDIR /app
COPY ./ /app
VOLUME /data
#RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN npm update --registry https://registry.npm.taobao.org
#RUN npm install --registry https://registry.npm.taobao.org
RUN cd /app && node build/build.js
EXPOSE 8080
CMD rm -f /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
NODE_ENV=DEBUG node core/startup.js