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
  animation.fillMode = .both
  animation.isRemovedOnCompletion = false
  layer.add(animation, forKey: "visibility")
}

func captionLayer(_ text: String, renderSize: CGSize, subtitleHeight: CGFloat) -> CALayer {
  let container = CALayer()
  container.frame = CGRect(x: 0, y: 0, width: renderSize.width, height: subtitleHeight)
  container.backgroundColor = NSColor(calibratedRed: 0.04, green: 0.06, blue: 0.11, alpha: 1).cgColor

  let labelBounds = CGRect(x: 40, y: subtitleHeight * 0.13, width: renderSize.width - 80, height: subtitleHeight * 0.74)
  let labelImage = NSImage(size: labelBounds.size)
  labelImage.lockFocus()
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = .center
  paragraph.lineBreakMode = .byWordWrapping
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
  guard let sourceVideo = asset.tracks(withMediaType: .video).first else {
    throw NSError(domain: "AndroidDaangnGuide", code: 1)
  }

  let composition = AVMutableComposition()
  guard let video = composition.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid) else {
    throw NSError(domain: "AndroidDaangnGuide", code: 2)
  }
  let fullRange = CMTimeRange(start: .zero, duration: asset.duration)
  try video.insertTimeRange(fullRange, of: sourceVideo, at: .zero)
  video.preferredTransform = sourceVideo.preferredTransform

  if let sourceAudio = asset.tracks(withMediaType: .audio).first,
     let audio = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid) {
    try audio.insertTimeRange(fullRange, of: sourceAudio, at: .zero)
  }

  let renderSize = sourceVideo.naturalSize
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
  videoLayer.frame = CGRect(
    x: round(renderSize.width * 0.05),
    y: subtitleHeight,
    width: round(renderSize.width * 0.90),
    height: renderSize.height - subtitleHeight
  )
  videoLayer.masksToBounds = true
  videoLayer.contentsGravity = .resizeAspectFill
  parent.addSublayer(videoLayer)

  for step in steps {
    let caption = captionLayer(step.caption, renderSize: renderSize, subtitleHeight: subtitleHeight)
    animateVisibility(caption, start: step.start, end: step.end)
    parent.addSublayer(caption)
  }
  videoComposition.animationTool = AVVideoCompositionCoreAnimationTool(postProcessingAsVideoLayer: videoLayer, in: parent)

  try FileManager.default.createDirectory(at: destination.deletingLastPathComponent(), withIntermediateDirectories: true)
  try? FileManager.default.removeItem(at: destination)
  guard let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetHighestQuality) else {
    throw NSError(domain: "AndroidDaangnGuide", code: 3)
  }
  exporter.outputURL = destination
  exporter.outputFileType = .mp4
  exporter.videoComposition = videoComposition
  exporter.shouldOptimizeForNetworkUse = true

  let semaphore = DispatchSemaphore(value: 0)
  exporter.exportAsynchronously { semaphore.signal() }
  semaphore.wait()
  guard exporter.status == .completed else {
    throw exporter.error ?? NSError(domain: "AndroidDaangnGuide", code: 4)
  }
}

let project = "/Users/miso/Desktop/Miso/now-use-project/miso-friend-hello"
try createGuide(
  sourcePath: "/Users/miso/Downloads/Screen_Recording_20260907_190057_Karrot.mp4",
  destinationPath: "\(project)/public/videos/daangn-post-guide-android.mp4",
  steps: [
    GuideStep(start: 0.0, end: 7.2, caption: "글쓰기에서 알바·과외·레슨을 선택하세요"),
    GuideStep(start: 7.3, end: 16.0, caption: "제목을 입력하세요"),
    GuideStep(start: 16.1, end: 34.0, caption: "어떤 일인지 내용을 적으세요"),
    GuideStep(start: 34.1, end: 47.0, caption: "내용을 확인한 뒤 다음을 누르세요"),
    GuideStep(start: 47.1, end: 57.2, caption: "활동 지역을 입력하세요"),
    GuideStep(start: 57.3, end: 65.5, caption: "게시되면 구인 관리에서 확인하세요"),
  ]
)
