FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
  git \
  curl \
  unzip \
  # sudo \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# non-root-userの追加
ARG USER_NAME=user
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USER_NAME \
  && useradd --gid $USER_GID --uid $USER_UID -m $USER_NAME -s /bin/bash
  # && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER_NAME \
  # && chmod 0440 /etc/sudoers.d/$USER_NAME

# non-root-userに切り替え
USER $USER_NAME

# bunのインストール
RUN curl -fsSL https://bun.sh/install | bash
