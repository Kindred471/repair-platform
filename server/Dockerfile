# 第一阶段：构建代码
FROM maven:3.9.5-eclipse-temurin-17 AS builder

WORKDIR /app
# 如果有 pom.xml 先复制并下载依赖（利用缓存加速后续构建）
COPY pom.xml .
# 这句能预先下载部分基础依赖，提高缓存命中率。不过因为某些项目配置问题可能会报错，如果没有可以直接 copy 源码构建。
# RUN mvn dependency:go-offline -B

# 复制源码内容
COPY src ./src
# 打包编译成 jar
RUN mvn clean package -DskipTests

# 第二阶段：运行阶段
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
# 设置时区（国内常用）
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 从 builder 阶段复制打包完的 jar 到最终镜像中
COPY --from=builder /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 运行项目
ENTRYPOINT ["java", "-jar", "app.jar"]
