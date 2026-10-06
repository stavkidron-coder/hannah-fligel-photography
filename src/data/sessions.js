import { isCloudinaryAlbum, cloudinaryId, cloudinaryUrl } from '../lib/cloudinary.js';

const GALLERY_WIDTH = 1000; // px: the default/fallback src (also used to measure orientation); components add a srcset for sharper screens

const session = (id, title, cat, folder, prefix, nums, coverNum, pathCat, root) => {
  const fc = pathCat || cat;
  const safePrefix = prefix.replace(/&/g, 'AND');
  const p = isCloudinaryAlbum(fc, folder)
    ? (n) => cloudinaryUrl(cloudinaryId(fc, folder, `${safePrefix}${n}`), GALLERY_WIDTH)
    : (n) => `/${root || 'images'}/${fc}/${folder}/${safePrefix}${n}.jpg`;
  const photos = nums.map(p);
  const cover = coverNum !== undefined ? p(coverNum) : photos[0];
  return { id, title, cat, photos, cover };
};

export const sessionsByCategory = {
  families: [
    session('amit-nate','Amit + Nate – Family Session','families','baby-ollie','baby-ollie',['20','27','28','29','30','32','35','37','40','41','44','50','52','54','57','58','65','68','73','80','82','84','86','91','93','96','101','102','104','105','106','108','109','117','119','124','126','129','138','143','145','151','152','155','157','158','160','161','164','167','168','169','175'],'160'),
    session('jasmin-dave','Jasmin + Dave – Family Session','families','dave-jasmin-lenny','Leon Newborn 5-26-24-',['1','4','5','7','10','12','16','18','21','22','24','25','28','29','33','34','35','38','39','46','49','51','53','54','56','57','60','62','67','69','70','72','73','77','81','84','90','96','103','111','112','113','117','123','125','126','128','129','136','139','142','146'],'39'),
    session('madison-tanya','Madison + Tanya – Family Session','families','madison-tanya-hunter','Madison_Tanya_Hunter_2025-08_',['05','09','11','15','21','49','55','65','86','92','104','130','134','142','152','164','241','247','254','257','260','266','283','306','310','313','323','327','354','358','381','388','390','391','407','423','430','432','437'],'381'),
    session('maguy-trae','Maguy + Trae – Family Session','families','maguy-trae-ivy','m&t-family-session',['1','4','8','13','17','19','21','25','30','35','39','42','49','57','65','72','83','90','92','101','102','104','106','110'],'21'),
    session('sarah-reid','Sarah + Reid – Family Session','families','bleil-family','Sarah&Reid-Family2023-',['2','18','30','35','41','46','48','64','66','71','77','85','93','102','103','108','114','116','124','131','134','137'],'2'),
    session('weidner','Weidner Family Session','families','weidner-family','Weidner-Family',['179','183','184','187','188','191','196','207','210','213','215','225','227','232','236','239','240','249','252','255','262','265','371'],'207'),
  ],
  maternity: [
    session('mana-chris','Mana + Chris – Maternity Session','maternity','mana-chris','McClintock2026-',['8','11','19','22','23','26','27','29','31','34','38','40','43','48','56','59','60','65','68','69','74','76','80','86','87','91','93','94','96','97','99','101','103','107','108','115','118','122','127','131','133','136','138','140','149','152','158','160','162','166','168','170','172','174','176','178','180','184','185','190','198','199','206','209','217','218','220','222','223','226','229','232','234','240','242','244','246','248','250','253','256','260'],'217'),
    session('angelica-eric','Angelica + Eric – Maternity Session','maternity','angelica-eric','A&E-Maternity',['1','3','8','9','11','12','20','21','26','27','28','30','33','38','39','40','46','50','51','54','57','58','62','63','65','66','68','73','75','76','79','81','84','85','88','93','97','99','102','104','106','107','111','112','113','116','118','120','127','128','131','132','134','137','138','141','145','146','149','150','154','155','159','161','163','165','167','168','172','175','176','177','178','181','182','184','188','191','192','195','197','200','201','203','204','205','207','208','209','215','216','220','222','223','224','225','226','227','228','230','231','233'],'66'),
  ],
  couples: [
    session('abby-prodahl','Abby — Portrait Session','couples','abby-prodahl','GR9A',['0051-Compressed','0075-Edit-Compressed','0126-Edit-2-Compressed','0217-Compressed','0295-Edit-Compressed','0323-Edit-Compressed','0329-Edit-Compressed','0373-Edit-Compressed','0389-Edit-Compressed','0394B&W-Compressed','9824-Compressed','9839-Compressed','9988-Edit-Compressed'],'0329-Edit-Compressed','portraits','images'),
    session('emma-senior','Emma — Senior Portraits','couples','emma-senior-photos','emma-senior-photos',['3','5','6','8','10','17','19','22','24','29','31','32','39','45','55','56','59','60','61','64','68','70','72','75','76','77','78','81','83','84','90','92','93','96','100','104','105','109','111','113','116','122','124','127','128','130','133','135','141','146','147','149','151','154','155','158','159'],'130','portraits'),
    session('ashly-felipe','Ashly + Felipe — Engagement','couples','ashly-felipe','Ashly&Felipe-engagement',['8-Compressed','30-Compressed','40-Compressed','78-Compressed','88-Compressed','94-Compressed','100-Compressed','110-Compressed','123-Compressed'],'94-Compressed','portraits','images'),
    session('dana-josh','Dana + Josh','couples','dana-josh','Dana&Josh',['1','3','6','8','12','14','17','24','25','27','35','38','40','42','45','60','62','70','76','81','84','92','97','104','116','125','127','130','132','143','145','146','156','162','163'],'84','portraits'),
    session('heidi-andre','Heidi + Andre','couples','heidi-andre','Heidi&Andre',['2','3','14','16','26','27','28','39','47','54','58','65','67','72','96','104','115','137','161','175','192','225','227','232','250','256','270','296','299'],'26','portraits'),
    session('nandini-srikanth','Nandini + Srikanth','couples','nandini-srikanth','Nandini&Srikanth',['1','49','50','51','52','54','57','64','65','75','80','84','87','94','98','102','103','106','119','129','155','165','171','176','181','184','187','188','191','203','204','209','218','224','229','230','246','249','256','259','260','269','279','289','305'],'102','portraits'),
    session('jess-calen','Jess + Calen – Proposal','couples','jess-calen','Jess&Calen-proposal',['15','23','32','36','47','51','52','60','61','64','69','78','85','87','90','99','107','110','111','116','122','125','129','131','138','154','160','166','168','170','171','179','191','193','196','197','198','200','202','203','210','211','217','220','226','227','231','232','234','235','236'],'47','portraits'),
  ],
};

export const allSessions = [...sessionsByCategory.families, ...sessionsByCategory.maternity, ...sessionsByCategory.couples];

export const catLabels = { families: 'Families', maternity: 'Maternity', couples: 'Couples & Individuals' };

export const catNotes = {
  everything: 'Every session, all in one place',
  families: 'Newborns & families',
  maternity: 'Expecting',
  couples: 'Individuals, couples, proposals, and engagements',
};

export const sessionQuotes = {
  'jess-calen': { quote: '“OMG these pics are gorgeous!!! I am blown away! You are extremely talented and I am so glad I asked you to capture these moments for us!! We are extremely grateful”', author: '— JESS, PROPOSAL & ENGAGEMENT SESSION' },
  'mana-chris': { quote: '“OMG, I am obsessed with every single photo. These are so stunning and dreamy.”', author: '— Mana & CHRIS, MATERNITY SESSION' },
  'angelica-eric': { quote: '“Thank you for all your work. My family loves them. They\'re an excellent memory for the rest of our lives.”', author: '— ANGELICA & ERIC, MATERNITY SESSION' },
};

export const savedOrder = {
  everything: ['angelica-eric','madison-tanya','heidi-andre','nandini-srikanth','maguy-trae','mana-chris','dana-josh','jess-calen','amit-nate','sarah-reid','jasmin-dave','weidner','abby-prodahl','emma-senior','ashly-felipe'],
};
