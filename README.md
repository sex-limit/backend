## 安装
```bash
bun i
```

## 配置mysql
- port 3306
- 数据库名：sex

## 执行prisma
```bash
prisma migrate dev --name init
bunx prisma generate
```

## 启动
```bash
bun run start:dev
```
