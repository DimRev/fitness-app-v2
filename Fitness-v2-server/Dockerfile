ARG GO_VERSION=1
FROM golang:${GO_VERSION}-bookworm as builder

WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN go build -v -o /run-app .

FROM debian:bookworm

# Install CA certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the application binary
COPY --from=builder /run-app /usr/local/bin/

# Copy the sql/schema directory to the final image
COPY --from=builder /usr/src/app/sql/schema /sql/schema

CMD ["run-app"]
