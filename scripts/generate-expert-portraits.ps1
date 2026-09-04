[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'

$apiKey = $env:AGNES_API_KEY
if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw '缺少 AGNES_API_KEY，无法生成专家头像。'
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'assets\branding'
$referencePath = Join-Path $outputDirectory 'expert-cartoon-01.jpg'
if (-not (Test-Path -LiteralPath $referencePath)) {
    throw "风格参考图不存在：$referencePath"
}

$referenceBytes = [System.IO.File]::ReadAllBytes($referencePath)
$referenceDataUrl = 'data:image/jpeg;base64,' + [System.Convert]::ToBase64String($referenceBytes)
$model = if ([string]::IsNullOrWhiteSpace($env:AGNES_IMAGE_MODEL)) { 'agnes-image-2.1-flash' } else { $env:AGNES_IMAGE_MODEL }
$baseUrl = if ([string]::IsNullOrWhiteSpace($env:AGNES_BASE_URL)) { 'https://apihub.agnes-ai.com/v1' } else { $env:AGNES_BASE_URL.TrimEnd('/') }

$sharedPrompt = @'
为深色企业级 AI 专家库生成一张原创卡通人物头像。只参考输入图片的二维数字插画风格、清晰黑色轮廓、友好表情和柔和低饱和背景，不复刻输入人物身份。竖版头肩构图，人物居中，头部与肩部完整，接近中国职场人物，画面在 100 像素宽时仍清晰。不要文字、标志、水印、边框、照片质感、3D、复杂道具或渐变。
'@

$variants = @(
    '男性产品策略师，短卷发，圆框眼镜，深蓝西装与白衬衫，青灰背景。',
    '男性全栈工程师，短发，深绿色连帽衫，鼠尾草绿背景。',
    '女性用户研究员，齐肩卷发，米白西装，暖杏色背景。',
    '女性品牌文案，长卷发，浅米色衬衫，淡紫灰背景。',
    '男性数据分析师，短发，方框眼镜，黑色衬衫，蓝灰背景。',
    '男性安全审计师，侧分短发，黑色西装与领带，深蓝背景。',
    '女性交互设计师，短发，深灰上衣，薄荷灰背景。',
    '男性技术写作专家，短卷发，黑框眼镜，浅蓝衬衫，雾蓝背景。',
    '女性增长顾问，中长发，深色西装与白色内搭，灰绿色背景。',
    '男性平台工程师，利落短发，藏青夹克与灰色圆领衫，冷灰蓝背景。',
    '女性前端工程师，齐耳短发，黑框眼镜，蓝绿色针织衫，浅青背景。',
    '男性 DevOps 工程师，寸头，深灰工装外套，雾蓝背景。',
    '女性数据工程师，低马尾，浅蓝衬衫与深色马甲，灰紫背景。',
    '男性云安全工程师，微卷短发，墨绿色衬衫，深青背景。',
    '女性嵌入式工程师，短卷发，卡其工装衬衫，暖灰背景。',
    '男性移动应用工程师，侧分短发，蓝色连帽外套，淡蓝背景。',
    '女性测试工程师，高马尾，深蓝圆领衫，浅绿色背景。',
    '男性 AI 工程师，自然卷短发，细框眼镜，灰蓝衬衫，蓝灰背景。',
    '女性网络工程师，齐肩直发，深绿色夹克，浅灰蓝背景。',
    '女性内容编辑，中长卷发，酒红色上衣，浅粉灰背景。',
    '男性技术文档作者，短发，方框眼镜，浅灰衬衫，雾青背景。',
    '女性社交媒体运营，丸子头，橄榄绿衬衫，暖黄色背景。',
    '男性 SEO 策略师，卷发，深蓝针织衫，浅灰紫背景。',
    '女性品牌文案，波浪短发，米白西装，柔和珊瑚色背景。',
    '男性视频脚本策划，蓬松短发，黑色高领衫，低饱和橙灰背景。',
    '女性产品经理，齐肩直发，深青西装与白色内搭，浅蓝灰背景。',
    '男性增长产品经理，短卷发，棕色休闲西装，灰绿色背景。',
    '女性项目经理，低马尾，海军蓝衬衫，淡紫背景。',
    '男性客户成功经理，侧分短发，浅灰西装与蓝色衬衫，青灰背景。',
    '女性统计研究员，短发，圆框眼镜，深灰西装，浅薄荷背景。',
    '男性金融分析师，整齐短发，黑框眼镜，深蓝西装，灰蓝背景。',
    '女性医学研究员，盘发，白色实验外套与浅蓝内搭，柔和青色背景。',
    '男性政策研究员，微卷短发，棕色西装与米色衬衫，浅灰背景。',
    '女性 UI 设计师，齐刘海短发，黑色圆领衫，淡紫蓝背景。',
    '男性品牌视觉设计师，自然卷发，圆框眼镜，米色夹克，浅橙灰背景。',
    '女性交互设计师，高马尾，深青色上衣，薄荷蓝背景。'
)

Add-Type -AssemblyName System.Net.Http
Add-Type -AssemblyName System.Drawing
$client = [System.Net.Http.HttpClient]::new()
$client.Timeout = [System.TimeSpan]::FromMinutes(3)
$client.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Bearer', $apiKey)
$downloadClient = [System.Net.Http.HttpClient]::new()
$downloadClient.Timeout = [System.TimeSpan]::FromMinutes(3)

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1
if ($null -eq $jpegEncoder) {
    throw '当前系统缺少 JPEG 编码器。'
}

try {
    for ($index = 0; $index -lt $variants.Count; $index++) {
        $number = $index + 1
        $outputPath = Join-Path $outputDirectory ('expert-cartoon-{0:D2}.jpg' -f $number)
        if (Test-Path -LiteralPath $outputPath) {
            Write-Output ("已存在头像 {0}/36，跳过生成" -f $number)
            continue
        }
        Write-Output ("正在生成头像 {0}/36" -f $number)
        $payload = @{
            model = $model
            prompt = "$sharedPrompt`n$($variants[$index])"
            size = '768x1024'
            image = @($referenceDataUrl)
            extra_body = @{ response_format = 'url' }
        } | ConvertTo-Json -Depth 5 -Compress
        $content = [System.Net.Http.StringContent]::new($payload, [System.Text.Encoding]::UTF8, 'application/json')
        try {
            $response = $client.PostAsync("$baseUrl/images/generations", $content).GetAwaiter().GetResult()
            $body = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if (-not $response.IsSuccessStatusCode) {
                throw "头像 $number 生成失败，接口状态码：$([int]$response.StatusCode)，响应：$body"
            }
            $result = $body | ConvertFrom-Json
            $imageUrl = $result.data[0].url
            if ([string]::IsNullOrWhiteSpace($imageUrl)) {
                throw "头像 $number 的接口响应未包含图片地址。"
            }
            # 对象存储签名地址不能携带 API 的 Bearer 头，否则会被判定为未授权。
            $imageBytes = $downloadClient.GetByteArrayAsync($imageUrl).GetAwaiter().GetResult()
        }
        finally {
            $content.Dispose()
        }

        $inputStream = [System.IO.MemoryStream]::new($imageBytes)
        $source = [System.Drawing.Image]::FromStream($inputStream)
        $target = [System.Drawing.Bitmap]::new(100, 134)
        $graphics = [System.Drawing.Graphics]::FromImage($target)
        try {
            $graphics.Clear([System.Drawing.Color]::FromArgb(30, 36, 42))
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $sourceRatio = $source.Width / $source.Height
            $targetRatio = 100 / 134
            if ($sourceRatio -gt $targetRatio) {
                $cropHeight = $source.Height
                $cropWidth = [int][Math]::Round($cropHeight * $targetRatio)
                $cropX = [int][Math]::Floor(($source.Width - $cropWidth) / 2)
                $cropY = 0
            }
            else {
                $cropWidth = $source.Width
                $cropHeight = [int][Math]::Round($cropWidth / $targetRatio)
                $cropX = 0
                $cropY = [int][Math]::Floor(($source.Height - $cropHeight) / 2)
            }
            $destination = [System.Drawing.Rectangle]::new(0, 0, 100, 134)
            $graphics.DrawImage($source, $destination, $cropX, $cropY, $cropWidth, $cropHeight, [System.Drawing.GraphicsUnit]::Pixel)

            $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
            try {
                $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [int64]80)
                $target.Save($outputPath, $jpegEncoder, $encoderParameters)
            }
            finally {
                $encoderParameters.Dispose()
            }
            $fileSize = (Get-Item -LiteralPath $outputPath).Length
            Write-Output ("已保存 {0}，{1} 字节" -f (Split-Path -Leaf $outputPath), $fileSize)
        }
        finally {
            $graphics.Dispose()
            $target.Dispose()
            $source.Dispose()
            $inputStream.Dispose()
        }
    }
}
finally {
    $downloadClient.Dispose()
    $client.Dispose()
}

$avatarFiles = Get-ChildItem -LiteralPath $outputDirectory -Filter 'expert-cartoon-*.jpg' | Sort-Object Name
if ($avatarFiles.Count -ne 36) {
    throw "头像数量应为 36，实际为 $($avatarFiles.Count)。"
}

$avatarSourcePath = Join-Path $projectRoot 'src\client\avatars.ts'
$sourceLines = @(
    '/** 三十六张原创轻量卡通立绘，按五大分类复用于完整专家库。 */',
    'export const EXPERT_AVATAR_URLS = ['
)
foreach ($avatarFile in $avatarFiles) {
    $avatarBytes = [System.IO.File]::ReadAllBytes($avatarFile.FullName)
    $avatarBase64 = [System.Convert]::ToBase64String($avatarBytes)
    $sourceLines += "  'data:image/jpeg;base64,$avatarBase64',"
}
$sourceLines += '] as const'
$sourceLines | Set-Content -LiteralPath $avatarSourcePath -Encoding UTF8
Write-Output "已更新头像数据文件：$avatarSourcePath"
