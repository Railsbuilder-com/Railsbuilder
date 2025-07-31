Component.create!([
  {
    name: 'Tekst Paragraf',
    component_type: 'text',
    description: 'En simpel tekstparagraf',
    default_content: { text: 'Klik for at redigere tekst' },
    default_styles: {
      fontSize: '16px',
      lineHeight: '1.6',
      margin: '16px 0'
    }
  },
  {
    name: 'Billede',
    component_type: 'image',
    description: 'Upload og vis et billede',
    default_content: {
      src: '/placeholder-image.jpg',
      alt: 'Beskrivende tekst'
    },
    default_styles: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px'
    }
  },
  {
    name: 'Knap',
    component_type: 'button',
    description: 'En klikkelig knap med link',
    default_content: {
      text: 'Klik her',
      link: '#',
      target: '_self'
    },
    default_styles: {
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: '6px',
      textDecoration: 'none',
      display: 'inline-block'
    }
  },
  {
    name: 'Overskrift',
    component_type: 'header',
    description: 'Stor overskrift med undertekst',
    default_content: {
      title: 'Din Overskrift',
      subtitle: 'En beskrivende undertekst'
    },
    default_styles: {
      textAlign: 'center',
      padding: '48px 0'
    }
  },
  {
    name: 'Footer',
    component_type: 'footer',
    description: 'Sidefod med kontaktinfo',
    default_content: {
      text: '© 2025 Dit Firmanavn. Alle rettigheder forbeholdes.',
      links: []
    },
    default_styles: {
      backgroundColor: '#1f2937',
      color: '#ffffff',
      padding: '24px',
      textAlign: 'center'
    }
  }
])

puts "Oprettet #{Component.count} standard komponenter"
