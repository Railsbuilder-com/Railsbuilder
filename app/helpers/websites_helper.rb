module WebsitesHelper
  def generate_video_embed(url)
    return "" if url.blank?

    if youtube_url?(url)
      video_id = extract_youtube_id(url)
      iframe_tag("https://www.youtube.com/embed/#{video_id}",
                       width: "100%", height: "315", frameborder: "0",
                       allowfullscreen: true, class: "rounded-xl")
    elsif vimeo_url?(url)
      video_id = extract_vimeo_id(url)
      iframe_tag("https://player.vimeo.com/video/#{video_id}",
                       width: "100%", height: "315", frameborder: "0",
                       allowfullscreen: true, class: "rounded-xl")
    else
      video_tag(url, width: "100%", height: "315", controls: true, class: "rounded-xl")
    end
  end

  private

  def youtube_url?(url)
    url.include?("youtube.com") || url.include?("youtu.be")
  end

  def vimeo_url?(url)
    url.include?("vimeo.com")
  end

  def extract_youtube_id(url)
    regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    match = url.match(regex)
    match && match[2].length == 11 ? match[2] : nil
  end

  def extract_vimeo_id(url)
    regex = /vimeo.com\/(\d+)/
    match = url.match(regex)
    match ? match[1] : nil
  end

  def iframe_tag(src, options = {})
    tag.iframe(nil, { src: src }.merge(options))
  end
end
