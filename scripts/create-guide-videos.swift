import AppKit
import AVFoundation
import Foundation

struct GuideStep {
  let start: Double
  let end: Double
  let caption: String
}

func animateVisibility(_ layer: CALayer, start: Double, end: Double) {
  layer.opacity = 0
  let animation = CAKeyframeAnimation(keyPath: "opacity")
  animation.values = [0, 1, 1, 0]
  animation.keyTimes = [0, 0.06, 0.94, 1]
  animation.duration = end - start
  animation.beginTime = AVCoreAnimationBeginTimeAtZero + start
  animation.isRemovedOnCompletion = false
  animation.fillMode = .both
  layer.add(animation, forKey: "visibility")
}

func captionLayer(_ text: String, step: Int, renderSize: CGSize, subtitleHeight: CGFloat) -> CALayer {
  let container = CALayer()
  container.frame = CGRect(x: 0, y: 0, width: renderSize.width, height: subtitleHeight)
  container.backgroundColor = NSColor(calibratedRed: 0.04, green: 0.06, blue: 0.11, alpha: 1).cgColor

  let labelBounds = CGRect(x: 40, y: subtitleHeight * 0.14, width: renderSize.width - 80, height: subtitleHeight * 0.72)
  let labelImage = NSImage(size: labelBounds.size)
  labelImage.lockFocus()
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = .center
  paragraph.lineBreakMode = .byTruncatingTail
  text.draw(in: CGRect(origin: .zero, size: labelBounds.size), withAttributes: [
    .font: NSFont.systemFont(ofSize: 54, weight: .bold),
    .foregroundColor: NSColor.white,
    .paragraphStyle: paragraph,
  ])
  labelImage.unlockFocus()
  let label = CALayer()
  label.frame = labelBounds
  label.contents = labelImage.cgImage(forProposedRect: nil, context: nil, hints: nil)
  label.contentsScale = NSScreen.main?.backingScaleFactor ?? 2
  container.addSublayer(label)
  return container
}

func createGuide(sourcePath: String, destinationPath: String, steps: [GuideStep]) throws {
  let source = URL(fileURLWithPath: sourcePath)
  let destination = URL(fileURLWithPath: destinationPath)
  let asset = AVURLAsset(url: source)
  guard let sourceVideo = asset.tracks(withMediaType: .video).first else { throw NSError(domain: "Guide", code: 1) }
  let composition = AVMutableComposition()
  guard let video = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else { throw NSError(domain: "Guide", code: 2) }
  let fullRange = CMTimeRange(start: .zero, duration: asset.duration)
  try video.insertTimeRange(fullRange, of: sourceVideo, at: .zero)
  video.preferredTransform = sourceVideo.preferredTransform
  if let sourceAudio = asset.tracks(withMediaType: .audio).first, let audio = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
    try audio.insertTimeRange(fullRange, of: sourceAudio, at: .zero)
  }

  let sourceSize = sourceVideo.naturalSize
  let renderSize = sourceSize
  let subtitleHeight = round(renderSize.height * 0.10)
  let instruction = AVMutableVideoCompositionInstruction()
  instruction.timeRange = fullRange
  let layerInstruction = AVMutableVideoCompositionLayerInstruction(assetTrack: video)
  layerInstruction.setTransform(sourceVideo.preferredTransform, at: .zero)
  instruction.layerInstructions = [layerInstruction]

  let videoComposition = AVMutableVideoComposition()
  videoComposition.renderSize = renderSize
  videoComposition.frameDuration = CMTime(value: 1, timescale: 30)
  videoComposition.instructions = [instruction]

  let parent = CALayer()
  parent.frame = CGRect(origin: .zero, size: renderSize)
  let videoLayer = CALayer()
  let videoFrame = CGRect(
    x: round(renderSize.width * 0.05),
    y: subtitleHeight,
    width: round(renderSize.width * 0.90),
    height: renderSize.height - subtitleHeight
  )
  videoLayer.frame = videoFrame
  videoLayer.masksToBounds = true
  videoLayer.contentsGravity = .resizeAspectFill
  parent.addSublayer(videoLayer)
  for (index, step) in steps.enumerated() {
    let caption = captionLayer(step.caption, step: index + 1, renderSize: renderSize, subtitleHeight: subtitleHeight)
    animateVisibility(caption, start: step.start, end: step.end)
    parent.addSublayer(caption)
  }
  videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parent)

  try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
  try? FileManager.default.removeItem(at: destination)
  guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else { throw NSError(domain: "Guide", code: 3) }
  exporter.outputURL = destination
  exporter.outputFileType = .mp4
  exporter.videoComposition = videoComposition
  exporter.shouldOptimizeForNetworkUse = true
  let semaphore = DispatchSemaphore(value: 0)
  exporter.exportAsynchronously { semaphore.signal() }
  semaphore.wait()
  guard exporter.status == .completed else { throw exporter.error ?? NSError(domain: "Guide", code: 4) }
}

let project = "/Users/miso/Desktop/Miso/now-use-project/miso-friend-hello"
try createGuide(
  sourcePath: "/Users/miso/Downloads/ScreenRecording_09-01-2026 16-45-45_1.MP4",
  destinationPath: "\(project)/public/videos/miso-invite-link-guide.mp4",
  steps: [
    GuideStep(start: 0.0, end: 2.6, caption: "친구 추천을 누르세요"),
    GuideStep(start: 2.8, end: 6.2, caption: "친구 초대하기를 누르세요"),
    GuideStep(start: 6.5, end: 10.7, caption: "내 초대 링크를 복사하세요"),
  ]
)

try createGuide(
  sourcePath: "/Users/miso/Downloads/ScreenRecording_09-01-2026 16-48-01_1.MP4",
  destinationPath: "\(project)/public/videos/blog-post-guide.mp4",
  steps: [
    GuideStep(start: 0.0, end: 4.8, caption: "블로그 글쓰기를 여세요"),
    GuideStep(start: 5.0, end: 17.0, caption: "글과 초대 링크를 넣으세요"),
    GuideStep(start: 17.3, end: 23.2, caption: "등록을 누르세요"),
  ]
)

try createGuide(
  sourcePath: "/Users/miso/Downloads/ScreenRecording_09-01-2026 16-49-57_1.MP4",
  destinationPath: "\(project)/public/videos/momcafe-post-guide.mp4",
  steps: [
    GuideStep(start: 0.0, end: 4.8, caption: "카페 게시판을 고르세요"),
    GuideStep(start: 5.0, end: 24.5, caption: "복사한 글을 넣으세요"),
    GuideStep(start: 25.0, end: 31.3, caption: "등록을 누르세요"),
  ]
)
