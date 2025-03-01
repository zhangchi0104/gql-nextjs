FROM public.ecr.aws/lambda/nodejs:20 as builder
WORKDIR /usr/app
COPY . .
RUN npm install
RUN npx turbo server#build


FROM public.ecr.aws/lambda/nodejs:20
WORKDIR /usr/app
COPY --from=builder /usr/app/apps/server/dist .
COPY --from=builder /usr/app/apps/server/package.json ./package.json
COPY --from=builder /usr/app//package.json ./package.json
RUN npm install --production

CMD ["handler.handler"]

