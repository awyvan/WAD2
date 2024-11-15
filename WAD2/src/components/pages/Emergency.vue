<template>
  
  <div style="margin-top: 5%">
    <h1>Emergency Clinics Nearby</h1>
  
    <div class="clinics">
  <div class="card-container">
    <ul class="cards">
      <li id="clinic-list" v-for="clinic in clinics" :key="clinic.NAME" class="card" >
        <!-- Clinic Card Start -->
        <div class="card-body">
          <h3 class="card-title"><b>{{ clinic.NAME }}</b></h3>
          <p class="card-text">&#128205; {{ clinic.distance ? clinic.distance : 'Fetching distance...' }} km away</p>    
          <h4 class="card-text">{{ clinic.TYPE }}</h4>          
        </div>
        <div class="card-body">
          <div class="buttons" >
            <a :href="getDirectionsUrl(clinic)" target="_blank" class="directions-link">
              Directions
            </a>
            <button type="button" style="border-radius: 15px" class="send" data-bs-toggle="modal" data-bs-target="#exampleModal" @click="fetchPetDetails">Send Pet Details</button>
          </div>
        </div>
        <!-- Clinic Card End -->
      </li>
    </ul>
  </div>
</div>
<!-- Button trigger modal -->



<div v-if="showModal" class="modal fade show" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false" style="display: block;" id="exampleModal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Pet Details</h5>
        <button type="button" class="btn-close" @click="showModal = false" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Render pet details -->
      <ul>
        <li v-for="(pet, index) in petDetailsArray" :key="index">

          <img class :src="pet[6]"  alt="Pet image"><br>
          <strong>{{ pet[0] }}</strong> <!-- Pet Name -->
          <ul>
            <li>Type: {{ pet[1] }} </li> <!-- Pet Type -->
            <li>Size: {{ pet[2] }} </li> <!-- Pet Size -->
            <li>Breed: {{ pet[3] }} </li> <!-- Pet Breed -->
            <li v-if="pet[4] !== ''">{{ pet[4] }} </li> <!-- Pet Dietary Restrictions -->
            <li v-if="pet[5] !== ''">{{ pet[5] }} </li> 
          </ul>
        </li>
      </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btcn " @click="showModal = false" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

  
  <script>
import axios from 'axios';
import db from '../../../database'
import {collection, getDocs} from 'firebase/firestore'
// Import geolocation functionality to calculate distance
export default {
  name: 'Emergency',
  data() {
    return {
     petDetailsArray : [],
      userLocation: { lat: null, lon: null },
      clinics: [
      {
  "NAME": "BEECROFT ANIMAL SPECIALIST & EMERGENCY HOSPITAL",
  "TYPE": "HOSPITAL",
  "ADDRESS": "991E ALEXANDRA ROAD, #01-27 S(119973)",
  "TEL-OFFICE": 69961812
 },
 {
  "NAME": "SINGAPORE TURF CLUB EQUINE HOSPITAL",
  "TYPE": "HOSPITAL",
  "ADDRESS": "1 TURF CLUB AVENUE, #01-01, S(738078)",
  "TEL-OFFICE": 68791000
 },
 {
  "NAME": "VES HOSPITAL (VETERINARY EMERGENCY & SPECIALTY HOSPITAL)",
  "TYPE": "HOSPITAL",
  "ADDRESS": "2 ROCHDALE ROAD, #01-01, S(535815)",
  "TEL-OFFICE": 65817028
 },
 {
  "NAME": "AAVC - ANIMAL & AVIAN VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "716 YISHUN STREET 71, #01-254, S(760716)",
  "TEL-OFFICE": 68539397
 },
 {
  "NAME": "ACACIA VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "338 ANG MO KIO AVENUE 1, #01-1671, S(560338)",
  "TEL-OFFICE": 64816889
 },
 {
  "NAME": "ADVANCED VETCARE @ BALESTIER",
  "TYPE": "CLINIC",
  "ADDRESS": "564A BALESTIER ROAD,S(329880)",
  "TEL-OFFICE": 65651788
 },
 {
  "NAME": "ADVANCED VET CARE & PET EMERGENCY",
  "TYPE": "CLINIC",
  "ADDRESS": "18 JALAN PARI BURONG, #01-01, S(488684)",
  "TEL-OFFICE": 66361788
 },
 {
  "NAME": "ALLPETS & AQUALIFE VETS PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "24 JALAN KELULUT, #01-01, S(809041)",
  "TEL-OFFICE": 64813700
 },
 {
  "NAME": "AMBER CAT VET PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "48 BURNFOOT TERRACE, #01-01, S(459836)",
  "TEL-OFFICE": 62455543
 },
 {
  "NAME": "AMBER VETERINARY PRACTICE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "50 BURNFOOT TERRACE, #01-01, S(459837)",
  "TEL-OFFICE": 62455543
 },
 {
  "NAME": "ANIMAL ARK VETERINARY GROUP (ANIMAL ARK BINJAI)",
  "TYPE": "CLINIC",
  "ADDRESS": "11 BINJAI PARK BINJAI PARK, S(589823)",
  "TEL-OFFICE": 61006000
 },
 {
  "NAME": "ANIMAL ARK VETERINARY GROUP (ANIMAL ARK TAMPINES)",
  "TYPE": "CLINIC",
  "ADDRESS": "139 TAMPINES STREET 11, #01-42, S(521139)",
  "TEL-OFFICE": 65871797
 },
 {
  "NAME": "ANIMAL INFIRMARY",
  "TYPE": "CLINIC",
  "ADDRESS": "112 LAVENDER STREET #01-01, S(338728)",
  "TEL-OFFICE": 63582663
 },
 {
  "NAME": "ANIMAL MEDICAL CENTRE (VET@RV) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "78 INDUS ROAD, #01-487, S(161078)",
  "TEL-OFFICE": 62710665
 },
 {
  "NAME": "ANIMAL RECOVERY VETERINARY CENTRE",
  "TYPE": "CLINIC",
  "ADDRESS": "482 SERANGOON ROAD #01-01, S(218149)",
  "TEL-OFFICE": 62522623
 },
 {
  "NAME": "ANIMAL WELLNESS CENTRE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "1 VISTA EXCHANGE GREEN, #01-15 THE STAR, S(138617)",
  "TEL-OFFICE": 66946383
 },
 {
  "NAME": "ANIMAL WORLD VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "16 YIO CHU KANG ROAD, #01-01, S(545527)",
  "TEL-OFFICE": 62860929
 },
 {
  "NAME": "APEX VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "462 RIVER VALLEY ROAD-462, S(248347)",
  "TEL-OFFICE": 67673369
 },
 {
  "NAME": "BARKWAY PET HEALTH PTE. LTD.",
  "TYPE": "CLINIC",
  "ADDRESS": "169 MACPHERSON ROAD, #01-00, S(348535)",
  "TEL-OFFICE": 69044300
 },
 {
  "NAME": "BEECROFT BIRD & EXOTICS VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "59 UPPER EAST COAST ROAD, S(455217)",
  "TEL-OFFICE": 68038344
 },
 {
  "NAME": "BRIGHTON VET CARE (BUKIT TIMAH) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "611 BUKIT TIMAH ROAD, S(269712)",
  "TEL-OFFICE": 62352250
 },
 {
  "NAME": "BRIGHTON VET CARE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "74 SERANGOON GARDEN WAY, #01-01, S(555970)",
  "TEL-OFFICE": 62822484
 },
 {
  "NAME": "CARE VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "124 LORONG 1 TOA PAYOH, #01-473, S(310124)",
  "TEL-OFFICE": 62500535
 },
 {
  "NAME": "CLINIC FOR PETS",
  "TYPE": "CLINIC",
  "ADDRESS": "1015 GEYLANG EAST AVENUE 3, #01-141, S(389730)",
  "TEL-OFFICE": 67451337
 },
 {
  "NAME": "COMPANION ANIMAL SURGERY PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "12 BOON TECK ROAD, #01-05, S(329586)",
  "TEL-OFFICE": 62557950
 },
 {
  "NAME": "DEFU VETERINARY CLINIC PTE. LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "37 DEFU LANE 10,#01-79 DEFU INDUSTRIAL ESTATES(539214)",
  "TEL-OFFICE": 62848411
 },
 {
  "NAME": "EDMOND TAN VETERINARY SURGERY",
  "TYPE": "CLINIC",
  "ADDRESS": "151 SERANGOON NORTH AVENUE 2, #01-65, S(550151)",
  "TEL-OFFICE": 62821581
 },
 {
  "NAME": "FRANKEL VETERINARY CENTRE",
  "TYPE": "CLINIC",
  "ADDRESS": "101 FRANKEL AVENUE, #01-01, S(458224)",
  "TEL-OFFICE": 68761212
 },
 {
  "NAME": "FURIENDS VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "211B PUNGGOL WALK, #01-627 PUNGGOL RIPPLES, S(822211)",
  "TEL-OFFICE": 62442112
 },
 {
  "NAME": "FURRYTAILS VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "2 JALAN LOKAM KENSINGTON SQUARE, S(537846)",
  "TEL-OFFICE": 62149092
 },
 {
  "NAME": "GAIA VETERINARY CENTRE",
  "TYPE": "CLINIC",
  "ADDRESS": "5 OPAL CRESCENT, S(328400)",
  "TEL-OFFICE": 69504533
 },
 {
  "NAME": "GENESIS VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "935 YISHUN CENTRAL 1, #01-43, S(760935)",
  "TEL-OFFICE": 62570682
 },
 {
  "NAME": "GENTLE OAK VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "21 GHIM MOH ROAD, #01-225, S(270021)",
  "TEL-OFFICE": 62508001
 },
 {
  "NAME": "HILLSIDE VETERINARY SURGERY PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "787A UPPER SERANGOON ROAD, S(534655)",
  "TEL-OFFICE": 69095338
 },
 {
  "NAME": "HOPE VETERINARY CARE",
  "TYPE": "CLINIC",
  "ADDRESS": "1017 UPPER SERANGOON ROAD, S(534755)",
  "TEL-OFFICE": 65189116
 },
 {
  "NAME": "ISLAND VETERINARY CLINIC (NORTHEAST) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "123 BEDOK NORTH STREET 2, #01-154, S(460123)",
  "TEL-OFFICE": 65605991
 },
 {
  "NAME": "ISLAND VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "114 JURONG EAST STREET 13, #01-404, S(600114)",
  "TEL-OFFICE": 65605991
 },
 {
  "NAME": "JAMES TAN VETERINARY CENTRE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "230 WHITLEY ROAD, #01-01, S(297823)",
  "TEL-OFFICE": 62531122
 },
 {
  "NAME": "JIREH VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "530 BALESTIER ROAD, #01-04, S(329857)",
  "TEL-OFFICE": 62669566
 },
 {
  "NAME": "LANDON VETERINARY SPECIALISTS",
  "TYPE": "CLINIC",
  "ADDRESS": "41 ENG KONG TERRACE, #01-01, S(599013)",
  "TEL-OFFICE": 64637228
 },
 {
  "NAME": "LIGHT OF LIFE VETERINARY CLINIC & SERVICES LLP",
  "TYPE": "CLINIC",
  "ADDRESS": "703 BEDOK RESERVOIR ROAD, #01-3508, S(470703)",
  "TEL-OFFICE": 62433282
 },
 {
  "NAME": "MARANATHA VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "77 TELOK BLANGAH DRIVE, #01-234, S(100077)",
  "TEL-OFFICE": 62730100
 },
 {
  "NAME": "MONSTER PET VET",
  "TYPE": "CLINIC",
  "ADDRESS": "6 EVERTON PARK, #01-16, S(080006)",
  "TEL-OFFICE": 63279148
 },
 {
  "NAME": "MOUNT PLEASANT ANIMAL MEDICAL CENTRE (2004) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "105 CLEMENTI STREET 12, #01-18, S(120105)",
  "TEL-OFFICE": 67768858
 },
 {
  "NAME": "MOUNT PLEASANT ANIMAL MEDICAL CENTRE (BEDOK) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "158 BEDOK SOUTH AVENUE 3, #01-577, S(460158)",
  "TEL-OFFICE": 64443561
 },
 {
  "NAME": "MOUNT PLEASANT ANIMAL MEDICAL CENTRE (FARRER) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "3 QUEEN'S ROAD, #02-141, S(260003)",
  "TEL-OFFICE": 62711132
 },
 {
  "NAME": "MOUNT PLEASANT VETERINARY CENTRE (2008) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "2 JALAN GELENGGANG, #01-01, S(578187)",
  "TEL-OFFICE": 62517666
 },
 {
  "NAME": "MOUNT PLEASANT VETERINARY CENTRE (CHANGI) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "848 SIMS AVENUE, #01-738, S(400848)",
  "TEL-OFFICE": 65460166
 },
 {
  "NAME": "MOUNT PLEASANT VETERINARY CENTRE (EAST) PTE.LTD.",
  "TYPE": "CLINIC",
  "ADDRESS": "152 EAST COAST ROAD, S(428855)",
  "TEL-OFFICE": 63486110
 },
 {
  "NAME": "MOUNT PLEASANT VETERINARY CENTRE (MANDAI) PTE. LTD.",
  "TYPE": "CLINIC",
  "ADDRESS": "236 YISHUN RING ROAD #01-1010, S(760236)",
  "TEL-OFFICE": 64515242
 },
 {
  "NAME": "MOUNT PLEASANT VETERINARY CENTRE (NORTH) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "151 SERANGOON NORTH AVENUE 2, #01-59, S(550151)",
  "TEL-OFFICE": 62871190
 },
 {
  "NAME": "MY FAMILY VET CLINIC AND SURGERY PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "265 BUKIT BATOK EAST AVENUE 4, #01-403, S(650265)",
  "TEL-OFFICE": 65660448
 },
 {
  "NAME": "NAM SANG VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "2 BALESTIER ROAD, #01-697, S(320002)",
  "TEL-OFFICE": 62548138
 },
 {
  "NAME": "NAMLY ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "74 NAMLY PLACE, #01-01, S(267223)",
  "TEL-OFFICE": 64694744
 },
 {
  "NAME": "OASIS VET",
  "TYPE": "CLINIC",
  "ADDRESS": "15 VENUS ROAD WINDSOR PARK, S(574302)",
  "TEL-OFFICE": 62562693
 },
 {
  "NAME": "OHANA VETCARE",
  "TYPE": "CLINIC",
  "ADDRESS": "258 PASIR RIS STREET 21, #04-01, S(510258)",
  "TEL-OFFICE": 62829070
 },
 {
  "NAME": "PAWS N CLAWS VETERINARY SURGERY PTE. LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "6 SIN MING ROAD,#01-04 SIN MING PLAZA S(575585)",
  "TEL-OFFICE": 88914417
 },
 {
  "NAME": "P.A.W. (PEOPLE ANIMAL WELLNESS) VETERINARY CENTRE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "112 BUKIT PURMEI ROAD, #01-207, S(090112)",
  "TEL-OFFICE": 62737573
 },
 {
  "NAME": "PASSION VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "111 WOODLANDS STREET 13, #01-86, S(730111)",
  "TEL-OFFICE": 66358725
 },
 {
  "NAME": "PERROVETS",
  "TYPE": "CLINIC",
  "ADDRESS": "416 ANG MO KIO AVENUE 10  #01-973, S(560416)",
  "TEL-OFFICE": 65130683
 },
 {
  "NAME": "PET CARE CENTRE & CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "4 WARINGIN PARK, #01-01, S(416318)",
  "TEL-OFFICE": 64485835
 },
 {
  "NAME": "PET CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "211 SERANGOON AVENUE 4, #01-12, S(550211)",
  "TEL-OFFICE": 62885565
 },
 {
  "NAME": "PETS AVENUE VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "8 EMPRESS ROAD, #01-11, S(260008)",
  "TEL-OFFICE": 64710111
 },
 {
  "NAME": "PETS AVENUE VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "50 JALAN JURONG KECHIL JK BUILDING, S(598578)",
  "TEL-OFFICE": 63630333
 },
 {
  "NAME": "PETS AVENUE VETERINARY CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "193 UPPER THOMSON ROAD, S(574338)",
  "TEL-OFFICE": 62590555
 },
 {
  "NAME": "POINT VETERINARY SURGERY",
  "TYPE": "CLINIC",
  "ADDRESS": "541 JURONG WEST AVENUE 1, #01-1044, S(640541)",
  "TEL-OFFICE": 64256772
 },
 {
  "NAME": "POINT VETERINARY SURGERY (TELOK BLANGAH)",
  "TYPE": "CLINIC",
  "ADDRESS": "38 TELOK BLANGAH RISE, #01-339, S(090038)",
  "TEL-OFFICE": 64256772
 },
 {
  "NAME": "QUEEN'S VET",
  "TYPE": "CLINIC",
  "ADDRESS": "3 QUEEN'S ROAD, #02-155 FARRER GARDENS, S(260003)",
  "TEL-OFFICE": 64750038
 },
 {
  "NAME": "REHABVET",
  "TYPE": "CLINIC",
  "ADDRESS": "513 SERANGOON ROAD, #01-01, S(218154)",
  "TEL-OFFICE": 62916881
 },
 {
  "NAME": "SINGAPORE VETERINARY ANIMAL CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "768 WOODLANDS AVENUE 6, #01-11, S(730768)",
  "TEL-OFFICE": 63650308
 },
 {
  "NAME": "SPCA",
  "TYPE": "CLINIC",
  "ADDRESS": "50 SUNGEI TENGAH ROAD, #01-01, S(699012)",
  "TEL-OFFICE": 62875355
 },
 {
  "NAME": "SPRING VETERINARY CARE",
  "TYPE": "CLINIC",
  "ADDRESS": "123 HOUGANG AVENUE 1, #01-1412, S(530123)",
  "TEL-OFFICE": 62863313
 },
 {
  "NAME": "SPRING VETERINARY CARE @ PUNGGOL",
  "TYPE": "CLINIC",
  "ADDRESS": "681 PUNGGOL DRIVE, #01-16A OASIS TERRACES, S(820681)",
  "TEL-OFFICE": 62441469
 },
 {
  "NAME": "STARS VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "211 HOUGANG STREET 21, #01-301, S(530211)",
  "TEL-OFFICE": 64524576
 },
 {
  "NAME": "SUNSHINE VET CARE PTE. LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "681 HOUGANG AVENUE 8, #01-841, S(530681)",
  "TEL-OFFICE": 66904045
 },
 {
  "NAME": "THE ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "109 CLEMENTI STREET 11, #01-19, S(120109)",
  "TEL-OFFICE": 64404767
 },
 {
  "NAME": "THE ANIMAL CLINIC PTE LTD (KATONG)",
  "TYPE": "CLINIC",
  "ADDRESS": "55 LORONG L, TELOK KURAU, #01-63, S(425500)",
  "TEL-OFFICE": 64404767
 },
 {
  "NAME": "THE ANIMAL DOCTORS (TIONG BAHRU) PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "11A BOON TIONG ROAD, #02-07, S(161011)",
  "TEL-OFFICE": 62533023
 },
 {
  "NAME": "THE ANIMAL DOCTORS PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "108 ANG MO KIO AVENUE 4, #01-94, S(560108)",
  "TEL-OFFICE": 64514531
 },
 {
  "NAME": "THE CAT CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "109 CLEMENTI STREET 11, #01-33, S(120109)",
  "TEL-OFFICE": 67763450
 },
 {
  "NAME": "THE CAT VET",
  "TYPE": "CLINIC",
  "ADDRESS": "2 Pandan Valley #B1-204D, S(597626)",
  "TEL-OFFICE": 63632272
 },
 {
  "NAME": "THE JOYOUS VET PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "475 CHOA CHU KANG AVE 3, #01-30A, S(680475)",
  "TEL-OFFICE": 67670304
 },
 {
  "NAME": "THE JOYOUS VET PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "1 YUAN CHING ROAD, #03-03, S(618640)",
  "TEL-OFFICE": 67670304
 },
 {
  "NAME": "THE PET DOCTORS VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "3 PANDAN VALLEY, #01-311, S(597627)",
  "TEL-OFFICE": 64750056
 },
 {
  "NAME": "THE VETERINARY CLINIC @ TAMPINES PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "476 TAMPINES STREET 44, #01-201, S(520476)",
  "TEL-OFFICE": 67842048
 },
 {
  "NAME": "THE VETERINARY CLINIC PTE LTD (HOLLAND VILLAGE)",
  "TYPE": "CLINIC",
  "ADDRESS": "31 LORONG LIPUT, #01-01, S(277742)",
  "TEL-OFFICE": 64686312
 },
 {
  "NAME": "THE VISITING VETS CLINIC",
  "ADDRESS": "9 TAMAN SERASI, #01-09, S(257720)",
  "TEL-OFFICE": 64753405
 },
 {
  "NAME": "TOA PAYOH VETS PTE. LTD.",
  "TYPE": "CLINIC",
  "ADDRESS": "1002 TOA PAYOH INDUSTRIAL PARK, #01-1477 TOA PAYOH INDUSTRIAL PARK, S(319074)",
  "TEL-OFFICE": 62543326
 },
 {
  "NAME": "TOWN VETS ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "22 HAVELOCK ROAD, #01-687, S(160022)",
  "TEL-OFFICE": 62767026
 },
 {
  "NAME": "TP ANIMAL CLINIC",
  "TYPE": "CLINIC",
  "ADDRESS": "21 TAMPINES AVENUE 1, #01-00 TEMASEK POLYTECHNIC, S(529757)",
  "TEL-OFFICE": 67806228
 },
 {
  "NAME": "UNITED VETERINARY CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "107 ANG MO KIO AVENUE 4, #01-148 KEBUN BARU HEIGHTS, S(560107)",
  "TEL-OFFICE": 64556880
 },
 {
  "NAME": "VET AFFINITY PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "151 BUKIT BATOK STREET 11,#01-248, S(650151)",
  "TEL-OFFICE": 69707505
 },
 {
  "NAME": "VET CENTRAL PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "69 LORONG 4 TOA PAYOH, #01-357, S(310069)",
  "TEL-OFFICE": 66358646
 },
 {
  "NAME": "VET PRACTICE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "21 LORONG KILAT, #01-04, S(598123)",
  "TEL-OFFICE": 64621757
 },
 {
  "NAME": "VET PRACTICE PTE LTD (HOLLAND BRANCH)",
  "TYPE": "CLINIC",
  "ADDRESS": "31 HOLLAND CLOSE, #01-219, S(270031)",
  "TEL-OFFICE": 64621757
 },
 {
  "NAME": "VETERINARY REHABILITATION AND HYDROTHERAPY CENTRE",
  "TYPE": "CLINIC",
  "ADDRESS": "631 BALESTIER ROAD, S(329918)",
  "TEL-OFFICE": 66101366
 },
 {
  "NAME": "VETS FOR LIFE ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "330B TANJONG KATONG ROAD, #01-01, S(437106)",
  "TEL-OFFICE": 63488346
 },
 {
  "NAME": "VETS FOR LIFE ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "491 RIVER VALLEY ROAD, #01-05, S(248371)",
  "TEL-OFFICE": 67320273
 },
 {
  "NAME": "VETS FOR LIFE ANIMAL CLINIC PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "182 JALAN JURONG KECHIL, #01-60 THE HILLFORD, S(596152)",
  "TEL-OFFICE": 69707070
 },
 {
  "NAME": "VETS FOR PETS",
  "TYPE": "CLINIC",
  "ADDRESS": "519 JURONG WEST STREET 52, #01-157, S(640519)",
  "TEL-OFFICE": 65691627
 },
 {
  "NAME": "VETS FOR PETS (LENGKOK BAHRU)",
  "TYPE": "CLINIC",
  "ADDRESS": "57 LENGKOK BAHRU #01-475, S(151057)",
  "TEL-OFFICE": 62556064
 },
 {
  "NAME": "WEST COAST VETCARE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "612 CLEMENTI WEST STREET 1, #01-300, S(120612)",
  "TEL-OFFICE": 67777423
 },
 {
  "NAME": "WHITLEY ANIMAL MEDICAL CENTRE PTE LTD",
  "TYPE": "CLINIC",
  "ADDRESS": "232 WHITLEY ROAD MOUNT PLEASANT ANIMAL HOSPITAL, S(297824)",
  "TEL-OFFICE": 62508333
 },
 {
  "NAME": "WOODGROVE VETERINARY SERVICES PTE. LTD.",
  "TYPE": "CLINIC",
  "ADDRESS": "30 WOODLANDS AVENUE 1, #02-06, S(739065)",
  "TEL-OFFICE": 69090624
 }
],
      showModal: false,
      petDetails: [],
      
      
    };
  },
  async created() {
  await this.getUserLocation();
  await this.getClinicsCoordinates();  // Ensure clinics coordinates are fetched before calculating distance
},
  methods: {
    async getClinicsCoordinates() {
      const geocodeUrl = "/api/geocode"; 
      const fetchCoordinatesPromises = this.clinics.map(async (clinic) => {
    try {
      const response = await axios.get(geocodeUrl, {
        params: { searchVal: clinic.ADDRESS,
          getAddrDetails: "Y",
          returnGeom: "Y"
         }
      });
      if (response.data.results && response.data.results[0]) {
        clinic.lat = parseFloat(response.data.results[0]["LATITUDE"]);
        clinic.lon = parseFloat(response.data.results[0]["LONGITUDE"]);
        console.log(clinic.lat,clinic.lon)
      }
    } catch (error) {
      console.error(`Error fetching geolocation for clinic: ${clinic.NAME}`, error);
      console.log("I didn not work")
    }
  });
  await Promise.all(fetchCoordinatesPromises);
  this.calculateDistances();
},
//retrieve
async fetchPetDetails() {
  try {
    const ownerName = localStorage.getItem('name');

    const petsCollectionRef = collection(db, `petowners/${ownerName}/pets`);
    const querySnapshot = await getDocs(petsCollectionRef);

    if (querySnapshot.empty) {
      console.log('No pets found for this owner!');
      return;
    }

    this.petDetails = querySnapshot.docs.map(doc => doc.data());
    const petDetailsArray = []; 
    console.log('Fetched Pet Details:', this.petDetails[0]); // Check if details are being fetched
    for (const pet of this.petDetails){
      petDetailsArray.push([pet.pet_name, pet.pet_type, pet.size, pet.breed, pet.dietary_restrictions, pet.medical_conditions, pet.picture_link])
    }
    console.log(petDetailsArray)
    this.showModal = true;
    this.petDetailsArray = petDetailsArray
  } catch (error) {
    console.log('Error fetching pet details:', error);
  }
},


    getUserLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.userLocation.lat = position.coords.latitude;
              this.userLocation.lon = position.coords.longitude;
              console.log(`User Location: lat=${this.userLocation.lat}, lon=${this.userLocation.lon}`);
              resolve();
            },
            (error) => {
              alert("Error fetching location: " + error.message);
              reject(error);
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
          reject(new Error("Geolocation not supported"));
        }
      });
    },

    calculateDistances() {
    // Calculate the distance from the user's location to each clinic
    this.clinics.forEach(clinic => {
      if (this.userLocation.lat && this.userLocation.lon && clinic.lat && clinic.lon) {
        const distance = this.calculateDistance(
          this.userLocation.lat,
          this.userLocation.lon,
          clinic.lat,
          clinic.lon
        );
        clinic.distance = (distance / 1000).toFixed(1); // Convert meters to kilometers
      } else {
        console.warn(`Missing coordinates for clinic: ${clinic.NAME}`);
        clinic.distance = Number.MAX_VALUE; // Assign a high value to missing distances so they appear last
      }
    });

    // Sort clinics by distance in ascending order
    this.clinics.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    this.clinics = this.clinics.slice(0,10)

    // Wait until the DOM has been updated before scrolling
    this.$nextTick(() => {
      this.scrollToNearestClinic();
    });
  },

  scrollToNearestClinic() {
    const firstClinic = document.querySelector('.cards li'); // Select the first clinic in the sorted list
    if (firstClinic) {
      firstClinic.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Smooth scroll to the nearest clinic
    }
  },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000; // Earth radius in meters
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // returns the distance in meters
    },
    getDirectionsUrl(clinic) {
      if (this.userLocation.lat && this.userLocation.lon && clinic.lat && clinic.lon) {
        return `https://www.google.com/maps/dir/?api=1&origin=${this.userLocation.lat},${this.userLocation.lon}&destination=${clinic.lat},${clinic.lon}&travelmode=driving`;
      }
    }
  }
}
</script>

  
<style>
h1 {
  margin-left: 1vw;
  font-family: 'Arial', sans-serif;
  color: #ecdfcc; /* Your original font color */
  font-weight: bold;
  text-align: center;
}

.clinics {
  margin: 2rem auto;
  text-align: center;
  width: 90vw;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.cards {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.card:hover {
  transform: scale(1.05);
}

.card-body {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  color: #ecdfcc; /* Your original font color */
}

.card-text {
  font-size: 1rem;
  color: #7c321b; /* Your original font color */
  margin: 0.5rem 0;
}

li img{
  border-radius: 50%;
  width: 30%;
  list-style-type: none;
}

.buttons {
  display: flex;
  justify-content: space-around;
  gap: 10px; /* Even spacing between buttons */
}

button,
a.directions-link {
  display: inline-flex; /* Ensure uniform alignment for buttons and links */
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffce6d, #f29040); /* Gradient background */
  color: #3c3d37; /* Text color */
  padding: 12px 20px; /* Consistent padding */
  font-size: 16px; /* Font size for all */
  font-weight: bold;
  text-decoration: none; /* Remove underline for <a> */
  border: none; /* Remove border for both */
  border-radius: 15px; /* Rounded corners */
  height: 50px; /* Uniform height */
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow for floating effect */
  transition: all 0.3s ease; /* Smooth transitions */
}

button:hover,
a.directions-link:hover {
  background: linear-gradient(135deg, #f29040, #ffce6d); /* Reverse gradient on hover */
  color: #ffffff; /* Brighten text on hover */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2); /* Enhance shadow */
  transform: translateY(-2px); /* Slight lift */
}

button:active,
a.directions-link:active {
  transform: translateY(1px); /* Subtle press effect */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Reduce shadow */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #3C3D37 !important ;
  padding: 20px;
  border-radius: 5px;
  width: 60%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
    margin: 0.5rem;
  }
}
.modal-backdrop {
   background-color: #3C3D37 ;
}

</style>
