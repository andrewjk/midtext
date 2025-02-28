// From https://github.com/commonmark/cmark/blob/master/src/utf8.c
export default function isPunctuation(code: number) {
	if (code < 128) {
		return isAsciiPunctuation(code);
	} else {
		return isUnicodePunctuation(code);
	}
}

function isAsciiPunctuation(code: number) {
	switch (code) {
		case 0x21: // !
		case 0x22: // "
		case 0x23: // #
		case 0x24: // $
		case 0x25: // %
		case 0x26: // &
		case 0x27: // '
		case 0x28: // (
		case 0x29: // )
		case 0x2a: // *
		case 0x2b: // +
		case 0x2c: // ,
		case 0x2d: // -
		case 0x2e: // .
		case 0x2f: // /
		case 0x3a: // :
		case 0x3b: // ;
		case 0x3c: // <
		case 0x3d: // =
		case 0x3e: // >
		case 0x3f: // ?
		case 0x40: // @
		case 0x5b: // [
		case 0x5c: // \
		case 0x5d: // ]
		case 0x5e: // ^
		case 0x5f: // _
		case 0x60: // `
		case 0x7b: // {
		case 0x7c: // |
		case 0x7d: // }
		case 0x7e: // ~
			return true;
		default:
			return false;
	}
}

function isUnicodePunctuation(code: number) {
	return (
		code > 128 &&
		((code >= 161 && code <= 169) ||
			(code >= 171 && code <= 172) ||
			(code >= 174 && code <= 177) ||
			code == 180 ||
			(code >= 182 && code <= 184) ||
			code == 187 ||
			code == 191 ||
			code == 215 ||
			code == 247 ||
			(code >= 706 && code <= 709) ||
			(code >= 722 && code <= 735) ||
			(code >= 741 && code <= 747) ||
			code == 749 ||
			(code >= 751 && code <= 767) ||
			code == 885 ||
			code == 894 ||
			(code >= 900 && code <= 901) ||
			code == 903 ||
			code == 1014 ||
			code == 1154 ||
			(code >= 1370 && code <= 1375) ||
			(code >= 1417 && code <= 1418) ||
			(code >= 1421 && code <= 1423) ||
			code == 1470 ||
			code == 1472 ||
			code == 1475 ||
			code == 1478 ||
			(code >= 1523 && code <= 1524) ||
			(code >= 1542 && code <= 1551) ||
			code == 1563 ||
			(code >= 1565 && code <= 1567) ||
			(code >= 1642 && code <= 1645) ||
			code == 1748 ||
			code == 1758 ||
			code == 1769 ||
			(code >= 1789 && code <= 1790) ||
			(code >= 1792 && code <= 1805) ||
			(code >= 2038 && code <= 2041) ||
			(code >= 2046 && code <= 2047) ||
			(code >= 2096 && code <= 2110) ||
			code == 2142 ||
			code == 2184 ||
			(code >= 2404 && code <= 2405) ||
			code == 2416 ||
			(code >= 2546 && code <= 2547) ||
			(code >= 2554 && code <= 2555) ||
			code == 2557 ||
			code == 2678 ||
			(code >= 2800 && code <= 2801) ||
			code == 2928 ||
			(code >= 3059 && code <= 3066) ||
			code == 3191 ||
			code == 3199 ||
			code == 3204 ||
			code == 3407 ||
			code == 3449 ||
			code == 3572 ||
			code == 3647 ||
			code == 3663 ||
			(code >= 3674 && code <= 3675) ||
			(code >= 3841 && code <= 3863) ||
			(code >= 3866 && code <= 3871) ||
			code == 3892 ||
			code == 3894 ||
			code == 3896 ||
			(code >= 3898 && code <= 3901) ||
			code == 3973 ||
			(code >= 4030 && code <= 4037) ||
			(code >= 4039 && code <= 4044) ||
			(code >= 4046 && code <= 4058) ||
			(code >= 4170 && code <= 4175) ||
			(code >= 4254 && code <= 4255) ||
			code == 4347 ||
			(code >= 4960 && code <= 4968) ||
			(code >= 5008 && code <= 5017) ||
			code == 5120 ||
			(code >= 5741 && code <= 5742) ||
			(code >= 5787 && code <= 5788) ||
			(code >= 5867 && code <= 5869) ||
			(code >= 5941 && code <= 5942) ||
			(code >= 6100 && code <= 6102) ||
			(code >= 6104 && code <= 6107) ||
			(code >= 6144 && code <= 6154) ||
			code == 6464 ||
			(code >= 6468 && code <= 6469) ||
			(code >= 6622 && code <= 6655) ||
			(code >= 6686 && code <= 6687) ||
			(code >= 6816 && code <= 6822) ||
			(code >= 6824 && code <= 6829) ||
			(code >= 7002 && code <= 7018) ||
			(code >= 7028 && code <= 7038) ||
			(code >= 7164 && code <= 7167) ||
			(code >= 7227 && code <= 7231) ||
			(code >= 7294 && code <= 7295) ||
			(code >= 7360 && code <= 7367) ||
			code == 7379 ||
			code == 8125 ||
			(code >= 8127 && code <= 8129) ||
			(code >= 8141 && code <= 8143) ||
			(code >= 8157 && code <= 8159) ||
			(code >= 8173 && code <= 8175) ||
			(code >= 8189 && code <= 8190) ||
			(code >= 8208 && code <= 8231) ||
			(code >= 8240 && code <= 8286) ||
			(code >= 8314 && code <= 8318) ||
			(code >= 8330 && code <= 8334) ||
			(code >= 8352 && code <= 8384) ||
			(code >= 8448 && code <= 8449) ||
			(code >= 8451 && code <= 8454) ||
			(code >= 8456 && code <= 8457) ||
			code == 8468 ||
			(code >= 8470 && code <= 8472) ||
			(code >= 8478 && code <= 8483) ||
			code == 8485 ||
			code == 8487 ||
			code == 8489 ||
			code == 8494 ||
			(code >= 8506 && code <= 8507) ||
			(code >= 8512 && code <= 8516) ||
			(code >= 8522 && code <= 8525) ||
			code == 8527 ||
			(code >= 8586 && code <= 8587) ||
			(code >= 8592 && code <= 9254) ||
			(code >= 9280 && code <= 9290) ||
			(code >= 9372 && code <= 9449) ||
			(code >= 9472 && code <= 10101) ||
			(code >= 10132 && code <= 11123) ||
			(code >= 11126 && code <= 11157) ||
			(code >= 11159 && code <= 11263) ||
			(code >= 11493 && code <= 11498) ||
			(code >= 11513 && code <= 11516) ||
			(code >= 11518 && code <= 11519) ||
			code == 11632 ||
			(code >= 11776 && code <= 11822) ||
			(code >= 11824 && code <= 11869) ||
			(code >= 11904 && code <= 11929) ||
			(code >= 11931 && code <= 12019) ||
			(code >= 12032 && code <= 12245) ||
			(code >= 12272 && code <= 12283) ||
			(code >= 12289 && code <= 12292) ||
			(code >= 12296 && code <= 12320) ||
			code == 12336 ||
			(code >= 12342 && code <= 12343) ||
			(code >= 12349 && code <= 12351) ||
			(code >= 12443 && code <= 12444) ||
			code == 12448 ||
			code == 12539 ||
			(code >= 12688 && code <= 12689) ||
			(code >= 12694 && code <= 12703) ||
			(code >= 12736 && code <= 12771) ||
			(code >= 12800 && code <= 12830) ||
			(code >= 12842 && code <= 12871) ||
			code == 12880 ||
			(code >= 12896 && code <= 12927) ||
			(code >= 12938 && code <= 12976) ||
			(code >= 12992 && code <= 13311) ||
			(code >= 19904 && code <= 19967) ||
			(code >= 42128 && code <= 42182) ||
			(code >= 42238 && code <= 42239) ||
			(code >= 42509 && code <= 42511) ||
			code == 42611 ||
			code == 42622 ||
			(code >= 42738 && code <= 42743) ||
			(code >= 42752 && code <= 42774) ||
			(code >= 42784 && code <= 42785) ||
			(code >= 42889 && code <= 42890) ||
			(code >= 43048 && code <= 43051) ||
			(code >= 43062 && code <= 43065) ||
			(code >= 43124 && code <= 43127) ||
			(code >= 43214 && code <= 43215) ||
			(code >= 43256 && code <= 43258) ||
			code == 43260 ||
			(code >= 43310 && code <= 43311) ||
			code == 43359 ||
			(code >= 43457 && code <= 43469) ||
			(code >= 43486 && code <= 43487) ||
			(code >= 43612 && code <= 43615) ||
			(code >= 43639 && code <= 43641) ||
			(code >= 43742 && code <= 43743) ||
			(code >= 43760 && code <= 43761) ||
			code == 43867 ||
			(code >= 43882 && code <= 43883) ||
			code == 44011 ||
			code == 64297 ||
			(code >= 64434 && code <= 64450) ||
			(code >= 64830 && code <= 64847) ||
			code == 64975 ||
			(code >= 65020 && code <= 65023) ||
			(code >= 65040 && code <= 65049) ||
			(code >= 65072 && code <= 65106) ||
			(code >= 65108 && code <= 65126) ||
			(code >= 65128 && code <= 65131) ||
			(code >= 65281 && code <= 65295) ||
			(code >= 65306 && code <= 65312) ||
			(code >= 65339 && code <= 65344) ||
			(code >= 65371 && code <= 65381) ||
			(code >= 65504 && code <= 65510) ||
			(code >= 65512 && code <= 65518) ||
			(code >= 65532 && code <= 65533) ||
			(code >= 65792 && code <= 65794) ||
			(code >= 65847 && code <= 65855) ||
			(code >= 65913 && code <= 65929) ||
			(code >= 65932 && code <= 65934) ||
			(code >= 65936 && code <= 65948) ||
			code == 65952 ||
			(code >= 66000 && code <= 66044) ||
			code == 66463 ||
			code == 66512 ||
			code == 66927 ||
			code == 67671 ||
			(code >= 67703 && code <= 67704) ||
			code == 67871 ||
			code == 67903 ||
			(code >= 68176 && code <= 68184) ||
			code == 68223 ||
			code == 68296 ||
			(code >= 68336 && code <= 68342) ||
			(code >= 68409 && code <= 68415) ||
			(code >= 68505 && code <= 68508) ||
			code == 69293 ||
			(code >= 69461 && code <= 69465) ||
			(code >= 69510 && code <= 69513) ||
			(code >= 69703 && code <= 69709) ||
			(code >= 69819 && code <= 69820) ||
			(code >= 69822 && code <= 69825) ||
			(code >= 69952 && code <= 69955) ||
			(code >= 70004 && code <= 70005) ||
			(code >= 70085 && code <= 70088) ||
			code == 70093 ||
			code == 70107 ||
			(code >= 70109 && code <= 70111) ||
			(code >= 70200 && code <= 70205) ||
			code == 70313 ||
			(code >= 70731 && code <= 70735) ||
			(code >= 70746 && code <= 70747) ||
			code == 70749 ||
			code == 70854 ||
			(code >= 71105 && code <= 71127) ||
			(code >= 71233 && code <= 71235) ||
			(code >= 71264 && code <= 71276) ||
			code == 71353 ||
			(code >= 71484 && code <= 71487) ||
			code == 71739 ||
			(code >= 72004 && code <= 72006) ||
			code == 72162 ||
			(code >= 72255 && code <= 72262) ||
			(code >= 72346 && code <= 72348) ||
			(code >= 72350 && code <= 72354) ||
			(code >= 72448 && code <= 72457) ||
			(code >= 72769 && code <= 72773) ||
			(code >= 72816 && code <= 72817) ||
			(code >= 73463 && code <= 73464) ||
			(code >= 73539 && code <= 73551) ||
			(code >= 73685 && code <= 73713) ||
			code == 73727 ||
			(code >= 74864 && code <= 74868) ||
			(code >= 77809 && code <= 77810) ||
			(code >= 92782 && code <= 92783) ||
			code == 92917 ||
			(code >= 92983 && code <= 92991) ||
			(code >= 92996 && code <= 92997) ||
			(code >= 93847 && code <= 93850) ||
			code == 94178 ||
			code == 113820 ||
			code == 113823 ||
			(code >= 118608 && code <= 118723) ||
			(code >= 118784 && code <= 119029) ||
			(code >= 119040 && code <= 119078) ||
			(code >= 119081 && code <= 119140) ||
			(code >= 119146 && code <= 119148) ||
			(code >= 119171 && code <= 119172) ||
			(code >= 119180 && code <= 119209) ||
			(code >= 119214 && code <= 119274) ||
			(code >= 119296 && code <= 119361) ||
			code == 119365 ||
			(code >= 119552 && code <= 119638) ||
			code == 120513 ||
			code == 120539 ||
			code == 120571 ||
			code == 120597 ||
			code == 120629 ||
			code == 120655 ||
			code == 120687 ||
			code == 120713 ||
			code == 120745 ||
			code == 120771 ||
			(code >= 120832 && code <= 121343) ||
			(code >= 121399 && code <= 121402) ||
			(code >= 121453 && code <= 121460) ||
			(code >= 121462 && code <= 121475) ||
			(code >= 121477 && code <= 121483) ||
			code == 123215 ||
			code == 123647 ||
			(code >= 125278 && code <= 125279) ||
			code == 126124 ||
			code == 126128 ||
			code == 126254 ||
			(code >= 126704 && code <= 126705) ||
			(code >= 126976 && code <= 127019) ||
			(code >= 127024 && code <= 127123) ||
			(code >= 127136 && code <= 127150) ||
			(code >= 127153 && code <= 127167) ||
			(code >= 127169 && code <= 127183) ||
			(code >= 127185 && code <= 127221) ||
			(code >= 127245 && code <= 127405) ||
			(code >= 127462 && code <= 127490) ||
			(code >= 127504 && code <= 127547) ||
			(code >= 127552 && code <= 127560) ||
			(code >= 127568 && code <= 127569) ||
			(code >= 127584 && code <= 127589) ||
			(code >= 127744 && code <= 128727) ||
			(code >= 128732 && code <= 128748) ||
			(code >= 128752 && code <= 128764) ||
			(code >= 128768 && code <= 128886) ||
			(code >= 128891 && code <= 128985) ||
			(code >= 128992 && code <= 129003) ||
			code == 129008 ||
			(code >= 129024 && code <= 129035) ||
			(code >= 129040 && code <= 129095) ||
			(code >= 129104 && code <= 129113) ||
			(code >= 129120 && code <= 129159) ||
			(code >= 129168 && code <= 129197) ||
			(code >= 129200 && code <= 129201) ||
			(code >= 129280 && code <= 129619) ||
			(code >= 129632 && code <= 129645) ||
			(code >= 129648 && code <= 129660) ||
			(code >= 129664 && code <= 129672) ||
			(code >= 129680 && code <= 129725) ||
			(code >= 129727 && code <= 129733) ||
			(code >= 129742 && code <= 129755) ||
			(code >= 129760 && code <= 129768) ||
			(code >= 129776 && code <= 129784) ||
			(code >= 129792 && code <= 129938) ||
			(code >= 129940 && code <= 129994))
	);
}
