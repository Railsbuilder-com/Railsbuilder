module ApplicationHelper
  def inline_styles(styles_hash)
    return "" unless styles_hash.is_a?(Hash)

    styles_hash.map do |property, value|
      # Konverter camelCase til kebab-case for CSS
      css_property = property.to_s.gsub(/([A-Z])/, '-\1').downcase
      "#{css_property}: #{value};"
    end.join(" ")
  end

  def component_classes(component_type)
    base_classes = "component-#{component_type}"

    case component_type
    when "text"
      "#{base_classes} prose"
    when "image"
      "#{base_classes} text-center"
    when "button"
      "#{base_classes} text-center"
    when "header"
      "#{base_classes} hero-section"
    when "footer"
      "#{base_classes} site-footer"
    else
      base_classes
    end
  end
end
