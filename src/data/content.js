import { cloudinaryFromLocal, cloudinaryUrl } from '../lib/cloudinary';
export const teaserPhotos = [
  cloudinaryUrl('galleries/families/baby-ollie/baby-ollie40', 1000),
  cloudinaryUrl('galleries/portraits/emma-senior-photos/emma-senior-photos147', 1000),
  cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth87', 1000),
  cloudinaryUrl('galleries/maternity/mana-chris/McClintock2026-94', 1000),
  cloudinaryFromLocal('/images/featured/GR9A0330-Edit-Compressed.jpg', 1000),
  cloudinaryUrl('galleries/portraits/heidi-andre/HeidiANDAndre14', 1000),
  cloudinaryUrl('galleries/families/maguy-trae-ivy/mANDt-family-session19', 1000),
  cloudinaryUrl('galleries/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_381', 1000),
  cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth102', 1000),
  cloudinaryFromLocal('/images/featured/GR9A0188-Edit-Compressed.jpg', 1000),
  cloudinaryUrl('galleries/families/weidner-family/Weidner-Family213', 1000),
  cloudinaryUrl('galleries/families/bleil-family/SarahANDReid-Family2023-18', 1000),
  cloudinaryUrl('galleries/maternity/angelica-eric/AANDE-Maternity57', 1000),
];

export const heroSlides = [
  { src: cloudinaryUrl('galleries/portraits/heidi-andre/HeidiANDAndre161', 2200), pos: 'center 40%' },
  { src: cloudinaryUrl('galleries/portraits/jess-calen/JessANDCalen-proposal23', 2200), pos: 'center 45%' },
  { src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth102', 2200), pos: 'center 50%' },
  { src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth50', 2200), pos: 'center 50%' },
  { src: cloudinaryUrl('galleries/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_432', 2200), pos: 'center 45%' },
];

export const testimonialsData = [
  { quote: '“OMG these pics are gorgeous!!! I am blown away! You are extremely talented and I am so glad I asked you to capture these moments for us!! We are extremely grateful”', author: '— JESS, PROPOSAL & ENGAGEMENT SESSION' },
  { quote: '“Thank you for all your work. My family loves them. They\'re an excellent memory for the rest of our lives.”', author: '— ANGELICA & ERIC, MATERNITY SESSION' },
  { quote: '“OMG, I am obsessed with every single photo. These are so stunning and dreamy.”', author: '— MANA & CHRIS, MATERNITY SESSION' },
];
