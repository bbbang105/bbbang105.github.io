import { Root as HTMLRoot } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  defaultImage?: string
}

const defaultOptions: Options = {
  defaultImage: undefined,
}

export const CoverImage: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CoverImage",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            // frontmatter에서 썸네일 지정 (thumbnail, cover, socialImage 순으로 확인)
            const fm = file.data.frontmatter
            if (fm?.thumbnail || fm?.cover || fm?.socialImage) {
              file.data.coverImage = (fm.thumbnail || fm.cover || fm.socialImage) as string
              return
            }

            // HTML 트리에서 첫 번째 이미지 찾기
            let firstImage: string | undefined

            visit(tree, "element", (node) => {
              if (firstImage) return // 이미 찾았으면 스킵

              if (node.tagName === "img" && node.properties?.src) {
                firstImage = node.properties.src as string
              }
            })

            // 이미지를 찾았으면 저장
            if (firstImage) {
              file.data.coverImage = firstImage
            } else if (opts.defaultImage) {
              file.data.coverImage = opts.defaultImage
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    coverImage: string
  }
}
