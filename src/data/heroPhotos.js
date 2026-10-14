import { cloudinaryUrl } from '../lib/cloudinary';

// The home hero photos, shared by the desktop strip (HeroEditorial) and the phone carousel (HeroCarousel).
// Each photo opens Work pre-filtered; the Work page only has Families / Maternity / Couples tabs, so portraits and engagements land on Couples.
// Landscape photos sit at 1, 4 and 7 so they are spread evenly through the loop.
export const heroPhotos = [
  { label: 'couples', cat: 'couples', src: cloudinaryUrl('galleries/portraits/heidi-andre/HeidiANDAndre161', 1400), ratio: '1600 / 1067' },
  { label: 'portraits', cat: 'couples', src: cloudinaryUrl('galleries/portraits/dana-josh/DanaANDJosh42', 1400), ratio: '1067 / 1600' },
  { label: 'maternity', cat: 'maternity', src: cloudinaryUrl('galleries/maternity/angelica-eric/AANDE-Maternity184', 1400), ratio: '1067 / 1600' },
  { label: 'families', cat: 'families', src: cloudinaryUrl('galleries/families/madison-tanya-hunter/Madison_Tanya_Hunter_2025-08_313', 1400), ratio: '1600 / 1067' },
  { label: 'senior photos', cat: 'couples', src: cloudinaryUrl('galleries/portraits/emma-senior-photos/emma-senior-photos147', 1400), ratio: '1067 / 1600' },
  { label: 'proposals', cat: 'couples', src: cloudinaryUrl('galleries/portraits/jess-calen/JessANDCalen-proposal15', 1400), ratio: '1067 / 1600' },
  { label: 'newborns', cat: 'families', src: cloudinaryUrl('galleries/families/dave-jasmin-lenny/Leon-Newborn-5-26-24-28', 1400), ratio: '1600 / 1067' },
  { label: 'engagements', cat: 'couples', src: cloudinaryUrl('galleries/portraits/nandini-srikanth/NandiniANDSrikanth256', 1400), ratio: '1067 / 1600' },
];
