# Bun Dev Container

![skill icons](https://skillicons.dev/icons?i=docker,bun,nodejs,ts,js)

## 起動方法

- `VSCode` にて [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) をインストール

- Dev Container の起動  
`shift + ctrl + P` で `Dev Containers: Rebuild and Reopen in Container` を実行

- Bun の実行確認  
`bun -v`

- 依存関係のインストール  
`bun install`

## tscとtsgoの比較

検証用に作成した10個のパッケージをturborepoで並列でコンパイルして検証します。  
turborepoが実行を仲介しているのでコンパイラのみ純粋な実行結果ではありません

- tsc  
`bun run tsc` -> 私の環境では約3.6s

```
 Tasks:    10 successful, 10 total
Cached:    0 cached, 10 total
  Time:    3.599s 
```

- tsgo  
`bun run tsgo` -> 私の環境では約0.71s

```
 Tasks:    10 successful, 10 total
Cached:    0 cached, 10 total
  Time:    710ms 
```

> 約5.1倍の高速化

### コンパイラ単体での検証方法

`cd packages/ui0`

- tsc  
`bun run tsc` -> 私の環境では約1.2s

```
Total time:                  1.21s
```

- tsgo  
`bun run tsgo` -> 私の環境では約0.23s

```
Total time:      0.229s
```

> 約5.2倍の高速化
