# 基础运行环境
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# 设置时区（国内常用）
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 直接将 GitHub 编译好的 jar 包复制进镜像
COPY target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 运行项目
ENTRYPOINT ["java", "-jar", "app.jar"]