#!/bin/bash

# 设置目标大小（以字节为单位，300KB = 307200 字节）
target_size=307200

# 设置目标尺寸
target_width=300
target_height=220

# 递归处理函数
process_directory() {
    local dir="$1"
    local mode="$2"
    
    # 根据模式设置调整尺寸的参数
    case "$mode" in
        "width")
            resize_param="${target_width}x"
            ;;
        "height")
            resize_param="x${target_height}"
            ;;
        "fixed")
            resize_param="${target_width}x${target_height}"
            ;;
        *)
            echo "无效的模式。请使用 'width'、'height' 或 'fixed'。"
            exit 1
            ;;
    esac
    
    # 遍历目录中的所有文件
    find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) | while read file; do
        echo "处理文件: $file"
        
        # 转换 CMYK 到 RGB
        colorspace=$(identify -format "%[colorspace]" "$file")
        if [ "$colorspace" = "CMYK" ]; then
            echo "转换 CMYK 到 RGB: $file"
            magick "$file" -colorspace RGB "$file"
        fi
        
        # 调整图片大小并设置初始质量
        if [ "$mode" = "fixed" ]; then
            magick "$file" -resize "${resize_param}>" -background white -gravity center -extent "${target_width}x${target_height}" -quality 90 "$file"
        else
            magick "$file" -resize "$resize_param" -quality 90 "$file"
        fi
        
        # 获取文件大小
        size=$(wc -c < "$file")
        
        # 如果文件大小超过目标大小，逐步降低质量直到达到目标大小
        while [ $size -gt $target_size ]; do
            quality=$(identify -format "%Q" "$file")
            new_quality=$((quality - 5))
            
            # 如果质量已经很低，但文件仍然太大，则使用更激进的压缩
            if [ $new_quality -lt 50 ]; then
                if [ "$mode" = "fixed" ]; then
                    magick "$file" -resize "${resize_param}>" -background white -gravity center -extent "${target_width}x${target_height}" -quality $new_quality -strip -interlace Plane -gaussian-blur 0.05 -compress JPEG "$file"
                else
                    magick "$file" -resize "$resize_param" -quality $new_quality -strip -interlace Plane -gaussian-blur 0.05 -compress JPEG "$file"
                fi
            else
                if [ "$mode" = "fixed" ]; then
                    magick "$file" -resize "${resize_param}>" -background white -gravity center -extent "${target_width}x${target_height}" -quality $new_quality "$file"
                else
                    magick "$file" -resize "$resize_param" -quality $new_quality "$file"
                fi
            fi
            
            size=$(wc -c < "$file")
        done
        
        echo "完成: $file ($(du -h "$file" | cut -f1))"
    done
}

# 检查是否提供了足够的参数
if [ $# -lt 2 ]; then
    echo "用法: $0 <目录路径> <模式>"
    echo "模式: width (宽度固定), height (高度固定), 或 fixed (固定宽高)"
    exit 1
fi

# 调用处理函数
process_directory "$1" "$2"

echo "所有图片处理完成"