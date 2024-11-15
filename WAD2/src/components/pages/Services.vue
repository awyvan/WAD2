<script>
import NavBar from '../NavBar.vue'
import axios from 'axios';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import  db  from '../../../database';
import { collection, query, where, addDoc, getDocs, deleteDoc, Timestamp, writeBatch, DocumentSnapshot, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

export default {
    data () {
        return {
            isPetOwner: true,
            alerttext: '',
            isalertVisible: false,
            currentPage: 'Find Services',
            iscurrentPage: [true,false,false,true,false,false],
            showPage: 'Find Services',
            previousPage: 'Find Services',
            transitionName: 'swipe-right',
            showButton: false,
            currServicePage: 'mainServicesPage',
            currJobPage: 'MainJobsPage',
            confirmPopup: false,
            jobevents: [],
            serviceevents: [],
            allservices: [],
            alljobs: [],
            myjobs: [],
            myservices: [],
            myongoingjobs: [],
            myongoingservices: [],
            mypastjobs: [],
            mypastservices: [],
            showModal: false,
            newEvent: {
                name: '',
                title: '',
                image: '../../../public/img/petjobicon.png',
                serviceTypeReq: [],
                specialReq:'',
                address: '',
                contactNum: '',
                startDateTime: '',
                endDateTime: '',
                payment: '',
                status: '',
            },
            newEventService: {
                name: '',
                title: '',
                image: '/img/petwalker.jpg',
                serviceTypeReq: [],
                skillsExp:'',
                address: '',
                contactNum: '',
                startDateTime: '',
                endDateTime: '',
                payment: '',
                status: '',
            },
            PetOwnerName: "", //need to connect to login so every calendar and my listings page are to the person
            ServiceProviderName: "", //need to connect to login so every calendar and my listings page are to the person
            selectedEvent: null,
            showOngoingListing: false,
            searchQuery: '',
            searchQueryS: '',
            mostRecentP: false,
            mostRecentS: false,
            reqServiceTypeP: false,
            reqServiceTypeS: false,
            selectedServiceTypesP: [],
            selectedServiceTypesS: [],
            selectedTimingsP: [],
            newTimeP: {
                start:'',
                end:'',
            },
            selectedTimingsS: [],
            newTimeS: {
                start:'',
                end:'',
            },
            errorsP: {},
            errorsS: {},
            }
    },
    props: {
    
  },
    mounted() {
        this.getUserInfo();
        this.getalljobs();
        this.getallservices();
        this.getIndivEvents();
        this.getIndivEventsService();
        this.transferExpiredService();
        this.transferExpiredJob();
        this.getmyjobs();
        this.getmyongoingjobs();
        this.getmypastjobs();
        this.getmyservices();
        this.getmyongoingservices();
        this.getmypastservices();
    },
    watch: {
        reqServiceTypeP(newValue) {
        if (!newValue && this.selectedServiceTypesP.length > 0) {
            this.selectedServiceTypesP = [];
        }
    },
        reqServiceTypeS(newValue) {
        if (!newValue && this.selectedServiceTypesS.length > 0) {
            this.selectedServiceTypesS = [];
        }
    },

    },
    methods: {
        getUserInfo(){
            const nameFromStorage = localStorage.getItem('name');

    // Check if nameFromStorage is null or undefined
        if (nameFromStorage) {
            this.PetOwnerName = nameFromStorage;
            this.newEvent.name = nameFromStorage;  // No need for toString() as localStorage returns a string
            this.ServiceProviderName = nameFromStorage;
            this.newEventService.name = nameFromStorage;
        } else {
            console.error("No 'name' found in localStorage");
        }
        },
        toggle() {
            if (this.isPetOwner) {
                this.isPetOwner = false;
                this.currentPage= 'Find Jobs';
            }
            else {
                this.isPetOwner = true;
                this.currentPage= 'Find Services';
            }
        },
        viewProfile(personName){ 
            this.$router.push({ name: 'otherProfile', params: { name: personName } });
        },
        checkpage(index) {
            this.iscurrentPage = [false,false,false,false,false,false];
            if (index === 0 || index === 3) {
                this.iscurrentPage[0] = true;
                this.iscurrentPage[3] = true;
            }
            else {
                this.iscurrentPage[index] = true;
            }
        },
        pageOrder(page) {
            const order=['Find Services','Post Jobs','Current Services','Find Jobs','Post Services','Current Services'];
            return order.indexOf(page);
        },
        navigate(page) {
            const currentPageOrder = this.pageOrder(this.showPage);
            const targetPageOrder = this.pageOrder(page);

            if (targetPageOrder > currentPageOrder) {
                
                this.transitionName = 'swipe-right';
            } else if (targetPageOrder < currentPageOrder) {
                
                this.transitionName = 'swipe-left';
            }

            this.previousPage = this.showPage;
            this.showPage = page; 
        },
        beforeEnter(el) {
            el.style.transform = 'translateX(100%)';
        },
        afterLeave(el) {
            el.style.transform = 'translateX(0)';
        },
        showbutton() {
            if (!this.showButton) {
                this.showButton=true;
            }
        },
        showconfirmPopup() {
            this.confirmPopup = true;
        },
        validateFormP() {
            this.errorsP = {};

            if (!this.newEvent.name) this.errorsP.name = 'Name is required';
            if (!this.newEvent.title) this.errorsP.title = 'Title is required';
            if (this.newEvent.serviceTypeReq.length === 0) this.errorsP.serviceTypeReq = 'Select at least one service';
            if (!this.newEvent.address) this.errorsP.address = 'Address is required';
            if (!this.newEvent.contactNum) this.errorsP.contactNum = 'Contact number is required';
            if (!this.newEvent.startDateTime) this.errorsP.startDateTime = 'Start date and time is required';
            if (!this.newEvent.endDateTime) this.errorsP.endDateTime = 'End date and time is required';

            if (!this.newEvent.payment) {
                this.errorsP.payment = 'Payment is required';
            } else if (parseFloat(this.newEvent.payment) > 50) {
                this.errorsP.payment = 'Payment cannot exceed $50 per hour';
            }
        },
        validateFormS() {
            this.errorsS = {};

            if (!this.newEvent.name) this.errorsS.name = 'Name is required';
            if (!this.newEvent.title) this.errorsS.title = 'Title is required';
            if (this.newEvent.serviceTypeReq.length === 0) this.errorsP.serviceTypeReq = 'Select at least one service';
            if (!this.newEvent.address) this.errorsS.address = 'Address is required';
            if (!this.newEvent.contactNum) this.errorsS.contactNum = 'Contact number is required';
            if (!this.newEvent.startDateTime) this.errorsS.startDateTime = 'Start date and time is required';
            if (!this.newEvent.endDateTime) this.errorsS.endDateTime = 'End date and time is required';

            if (!this.newEvent.payment) {
                this.errorsS.payment = 'Payment is required';
            } else if (parseFloat(this.newEvent.payment) > 50) {
                this.errorsS.payment = 'Payment cannot exceed $50 per hour';
            }
        },
        viewMore(event) {
            this.selectedEvent = event;
            this.showOngoingListing = true;
        },
        closeListing() {
            this.showOngoingListing = false;
            this.selectedEvent = null;
        },
        showalert() {
            this.isalertVisible = true;
            setTimeout(() => {
                this.isalertVisible = false;
            }, 3000);
            if (this.isPetOwner) {
                this.alerttext ='Pet Owner'
            } else {
                this.alerttext ='Service Provider'
            }
        },
        async addJob() {
            try {
                const eventRef = await addDoc(collection(db,'jobs'), {
                    name: this.newEvent.name,
                    title: this.newEvent.title,
                    image: '../../../public/img/petjobicon.png',
                    serviceTypeReq: this.newEvent.serviceTypeReq,
                    specialReq: this.newEvent.specialReq,
                    address: this.newEvent.address,
                    contactNum: this.newEvent.contactNum,
                    start: this.newEvent.startDateTime,
                    end: this.newEvent.endDateTime,
                    payment: this.newEvent.payment,
                    status: '',
                    documentId: '',
                    linkedPerson:'',
                });
                await updateDoc(eventRef, {
                    documentId: eventRef.id,
                });
                console.log("Document written with ID: ", eventRef.id)
                this.newEvent = {
                    name: '',
                title: '',
                image: '../../../public/img/petjobicon.png',
                serviceTypeReq: [],
                specialReq:'',
                address: '',
                contactNum: '',
                startDateTime: '',
                endDateTime: '',
                payment: '',
                status: '',
                documentId: '',
                linkedPerson:'',
                };
            } catch (e) {
                console.error("Error adding document: ",e);
            }
        },
        async addService() {
            try {
                const eventRef = await addDoc(collection(db,'services'), {
                    name: this.newEventService.name,
                    title: this.newEventService.title,
                    image: '/img/petsitter.jpg',
                    serviceTypeReq: this.newEventService.serviceTypeReq,
                    skillsExp: this.newEventService.skillsExp,
                    address: this.newEventService.address,
                    contactNum: this.newEventService.contactNum,
                    start: this.newEventService.startDateTime,
                    end: this.newEventService.endDateTime,
                    payment: this.newEventService.payment,
                    status: '',
                    documentId: '',
                    linkedPerson: '',
                });
                await updateDoc(eventRef, {
                    documentId: eventRef.id,
                });
                console.log("Document written with ID: ", eventRef.id)
                this.newEventService = {
                    name: '',
                    title: '',
                    image: '/img/petsitter.jpg',
                    serviceTypeReq: [],
                    skillsExp:'',
                    address: '',
                    contactNum: '',
                    startDateTime: '',
                    endDateTime: '',
                    payment: '',
                    status: '',
                    documentId: '',
                    linkedPerson:'',
                };
            } catch (e) {
                console.error("Error adding document: ",e);
            }
        },
        async getIndivEvents() {
            try{
            const q = query(collection(db,'jobs'), where ('name', '==', this.PetOwnerName))
            const querySnapshot = await getDocs(q);
            this.jobevents = querySnapshot.docs.map(doc => {
                const data = doc.data() ;
                const start = data.start.replace('T', ' ');
                const end = data.end.replace('T', ' ');
                return {
                title: data.title,
                start: start,
                end: end,
                };
            });
            console.log("Filtered job events:", this.jobevents);
        } catch (error) {
            console.error("Error fetching events: ", error);
            }
        },
        async getIndivEventsService() {
            try{
            const q = query(collection(db,'services'), where ('name', '==', this.ServiceProviderName))
            const querySnapshot = await getDocs(q);
            this.serviceevents = querySnapshot.docs.map(doc => {
                const data = doc.data() ;
                const start = data.start.replace('T', ' ');
                const end = data.end.replace('T', ' ');
                return {
                title: data.title,
                start: start,
                end: end,
                };
            });
            console.log("Filtered job events:", this.serviceevents);
        } catch (error) {
            console.error("Error fetching events: ", error);
            }
        },
        async getmyongoingjobs() {
            try {
                const getdatabyname = query(collection(db,'ongoing'), where('name','==',this.PetOwnerName));
                const getdatabylinkedPerson = query(collection(db,'ongoing'),where('linkedPerson','==',this.PetOwnerName));
                const [nameSnapshot, linkedPersonSnapshot] = await Promise.all([
                    getDocs(getdatabyname),
                    getDocs(getdatabylinkedPerson)
                ]);
                let ongoingjobs=[];
                nameSnapshot.docs.forEach(doc => {
                    ongoingjobs.push({
                        ...doc.data(),
                        start: doc.data().start.replace('T', ' '),
                        end: doc.data().end.replace('T', ' '),
                    });
                });
                linkedPersonSnapshot.docs.forEach(doc => {
                    const data =doc.data();
                    if (!ongoingjobs.some(job=>job.documentId === data.documentId)) {
                        ongoingjobs.push({
                            ...data,
                            start: data.start.replace('T', ' '),
                            end: data.end.replace('T', ' ')
                        });
                    }
                });
                this.myongoingjobs = ongoingjobs;
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getmyongoingservices() {
            try {
                const getdatabyname = query(collection(db,'ongoing'), where('name','==',this.ServiceProviderName));
                const getdatabylinkedPerson = query(collection(db,'ongoing'),where('linkedPerson','==',this.ServiceProviderName));
                const [nameSnapshot, linkedPersonSnapshot] = await Promise.all([
                    getDocs(getdatabyname),
                    getDocs(getdatabylinkedPerson)
                ]);
                let ongoingservices=[];
                nameSnapshot.docs.forEach(doc => {
                    ongoingservices.push({
                        ...doc.data(),
                        start: doc.data().start.replace('T', ' '),
                        end: doc.data().end.replace('T', ' '),
                    });
                });
                linkedPersonSnapshot.docs.forEach(doc => {
                    const data =doc.data();
                    if (!ongoingservices.some(job=>job.documentId === data.documentId)) {
                        ongoingservices.push({
                            ...data,
                            start: data.start.replace('T', ' '),
                            end: data.end.replace('T', ' ')
                        });
                    }
                });
                this.myongoingservices = ongoingservices;
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getmyjobs() {
            try {
                const getdatabyname = query(collection(db,'jobs'), where ('name','==', this.PetOwnerName))
                const querySnapshot = await getDocs(getdatabyname);
                this.myjobs = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const start = data.start.replace('T', ' ');
                    const end = data.end.replace('T', ' ');
                    return {
                    title: data.title,
                    start: start,
                    end: end,
                    name: data.name,
                    image: data.image,
                    serviceTypeReq: data.serviceTypeReq,
                    specialReq:data.specialReq,
                    address: data.address,
                    contactNum: data.contactNum,
                    payment: data.payment,
                    status: data.status,
                    documentId: data.documentId,
                    linkedPerson: data.linkedPerson,
                    };
                }
                
            );

            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getmyservices() {
            try {
                const getdatabyname = query(collection(db,'services'), where ('name','==', this.ServiceProviderName))
                const querySnapshot = await getDocs(getdatabyname);
                this.myservices = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    const start = data.start.replace('T', ' ');
                    const end = data.end.replace('T', ' ');
                    return {
                    title: data.title,
                    start: start,
                    end: end,
                    name: data.name,
                    image: data.image,
                    serviceTypeReq: data.serviceTypeReq,
                    skillsExp:data.skillsExp,
                    address: data.address,
                    contactNum: data.contactNum,
                    payment: data.payment,
                    status: data.status,
                    documentId: data.documentId,
                    linkedPerson: data.linkedPerson,
                    };
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getmypastjobs() {
            try {
                const getdatabynamepj = query(collection(db,'pastjobs'), where ('name','==', this.PetOwnerName))
                const getdatabylinkedPersonpj = query(collection(db,'pastjobs'), where ('linkedPerson','==', this.PetOwnerName))
                const getdatabylinkedPersonps = query(collection(db,'pastservices'), where('linkedPerson','==',this.PetOwnerName))
                const getdatabynameps = query(collection(db,'pastservices'), where ('name','==', this.PetOwnerName))
                const [querySnapshot1, querySnapshot2, querySnapshot3, querySnapshot4] = await Promise.all([
                getDocs(getdatabynamepj),
                getDocs(getdatabylinkedPersonpj),
                getDocs(getdatabylinkedPersonps),
                getDocs(getdatabynameps)
                ]);
                const pastjobsData1 = querySnapshot1.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastjobsData2 = querySnapshot2.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastservicesData1 = querySnapshot3.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastservicesData2 = querySnapshot4.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                this.mypastjobs = [...pastjobsData1,...pastjobsData2,...pastservicesData1,...pastservicesData2]
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getmypastservices() {
            try {
                const getdatabynameps = query(collection(db,'pastservices'), where ('name','==', this.ServiceProviderName));
                const getdatabylinkedPersonps = query(collection(db,'pastservices'), where ('linkedPerson','==', this.ServiceProviderName));
                const getdatabylinkedPersonpj = query(collection(db,'pastjobs'), where('linkedPerson','==',this.ServiceProviderName));
                const getdatabynamepj = query(collection(db,'pastjobs'), where ('name','==', this.ServiceProviderName));
                const [querySnapshot1, querySnapshot2, querySnapshot3, querySnapshot4] = await Promise.all([
                getDocs(getdatabynameps),
                getDocs(getdatabylinkedPersonps),
                getDocs(getdatabylinkedPersonpj),
                getDocs(getdatabynamepj),
                ]);
                const pastservicesData1 = querySnapshot1.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastservicesData2 = querySnapshot2.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastjobsData1 = querySnapshot3.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                const pastjobsData2 = querySnapshot4.docs.map(doc => {
                    const data = doc.data();
                    return {
                    ...data,
                    start: data.start.replace('T', ' '),
                    end: data.end.replace('T', ' ')
                    };
                });
                this.mypastservices=[...pastjobsData1,...pastjobsData2,...pastservicesData1,...pastservicesData2]
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async transferExpiredJob() {
            const fromCollectionRef=collection(db,'jobs');
            const toCollectionRef=collection(db,'pastjobs');
            const today = new Date();
            try {
                const snapshot = await getDocs(fromCollectionRef);

                if (snapshot.empty) {
                    console.log('No matching documents found.');
                    return;
                }

                const batch = writeBatch(db);
                snapshot.forEach(DocumentSnapshot => {
                    const data = DocumentSnapshot.data();

                    const docDate = new Date(data.end);

                    if (docDate < today) {
                        const destinationDocRef = doc(toCollectionRef, DocumentSnapshot.id);
                        batch.set(destinationDocRef,data, {merge: true});
                        batch.update(destinationDocRef, {status: 'expired'});
                        batch.delete(DocumentSnapshot.ref)
                    }
                });
                await batch.commit();
                console.log(`Transferred ${snapshot.size} documents.`);
            } catch (error) {
                console.log("Error transferring documents:", error);
            }
        },
        async transferExpiredService() {
            const fromCollectionRef=collection(db,'services');
            const toCollectionRef=collection(db,'pastservices');
            const today = new Date();
            try {
                const snapshot = await getDocs(fromCollectionRef);

                if (snapshot.empty) {
                    console.log('No matching documents found.');
                    return;
                }

                const batch = writeBatch(db);
                snapshot.forEach(DocumentSnapshot => {
                    const data = DocumentSnapshot.data();

                    const docDate = new Date(data.end);

                    if (docDate < today) {
                        const destinationDocRef = doc(toCollectionRef, DocumentSnapshot.id);
                        batch.set(destinationDocRef,data, {merge: true});
                        batch.update(destinationDocRef, {status: 'expired'});
                        batch.delete(DocumentSnapshot.ref)
                    }
                });
                await batch.commit();
                console.log(`Transferred ${snapshot.size} documents.`);
            } catch (error) {
                console.log("Error transferring documents:", error);
            }
        },
        async cancelService(id) {
        try {
                
                const fromCollectionRef = doc(db, 'services', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'cancelled'
                    });
                    console.log('Status updated to "cancelled".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastservices', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async cancelJob(id) {
            try {
                
                const fromCollectionRef = doc(db, 'jobs', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'cancelled'
                    });
                    console.log('Status updated to "cancelled".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastjobs', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async ongoingJob(id) {
            try {
                
                const fromCollectionRef = doc(db, 'jobs', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'ongoing',
                        linkedPerson: this.ServiceProviderName,
                    });
                    console.log('Status updated to "ongoing".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'ongoing', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async ongoingService(id) {
            try {
                
                const fromCollectionRef = doc(db, 'services', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'ongoing',
                        linkedPerson: this.PetOwnerName,
                    });
                    console.log('Status updated to "ongoing".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'ongoing', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async cancelOngoingService(id) {
            try {
                
                const fromCollectionRef = doc(db, 'ongoing', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'cancelled'
                    });
                    console.log('Status updated to "cancelled".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastservices', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async cancelOngoingJob(id) {
            try {
                
                const fromCollectionRef = doc(db, 'ongoing', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'cancelled'
                    });
                    console.log('Status updated to "cancelled".');

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastjobs', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async completeOngoingService(id) {
            try {
                
                const fromCollectionRef = doc(db, 'ongoing', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'complete'
                    });
                    

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastservices', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async completeOngoingJob(id) {
            try {
                
                const fromCollectionRef = doc(db, 'ongoing', id);
                const docSnap = await getDoc(fromCollectionRef);

                if (docSnap.exists()) {
                    await updateDoc(fromCollectionRef, {
                        status: 'complete'
                    });

                    const updatedDocSnap = await getDoc(fromCollectionRef);
                    console.log('Updated document:', updatedDocSnap.data());

                    const toCollectionRef = doc(db, 'pastjobs', id);
                    await setDoc(toCollectionRef, updatedDocSnap.data());
                    await deleteDoc(fromCollectionRef);
                    
                } else {
                    console.log("No such document");
                }
            } catch (error) {
                console.error('Error transferring service:', error);
            }
        },
        async getalljobs() {
            try {
                const Snapshot = await getDocs(collection(db,'jobs'));
                this.alljobs = Snapshot.docs.map(doc => {
                    const data = doc.data();
                    const start = data.start.replace('T', ' ');
                    const end = data.end.replace('T', ' ');
                    return {
                    title: data.title,
                    start: start,
                    end: end,
                    name: data.name,
                    image: data.image,
                    serviceTypeReq: data.serviceTypeReq,
                    specialReq:data.specialReq,
                    address: data.address,
                    contactNum: data.contactNum,
                    payment: data.payment,
                    status: data.status,
                    documentId: data.documentId,
                    linkedPerson: data.linkedPerson,
                    };
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        async getallservices() {
            try {
                const Snapshot = await getDocs(collection(db,'services'));
                this.allservices = Snapshot.docs.map(doc => {
                    const data = doc.data();
                    const start = data.start.replace('T', ' ');
                    const end = data.end.replace('T', ' ');
                    return {
                    title: data.title,
                    start: start,
                    end: end,
                    name: data.name,
                    image: data.image,
                    serviceTypeReq: data.serviceTypeReq,
                    skillsExp:data.skillsExp,
                    address: data.address,
                    contactNum: data.contactNum,
                    payment: data.payment,
                    status: data.status,
                    documentId: data.documentId,
                    linkedPerson: data.linkedPerson,
                    };
                });
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        },
        updateTimeP() {
            if (this.newTimeP.start && this.newTimeP.end) {
                const event = {
                    start:this.newTimeP.start.replace('T', ' '),
                    end: this.newTimeP.end.replace('T', ' '),
                };
                this.selectedTimingsP = [event];
            }
        },
        updateTimeS() {
            if (this.newTimeS.start && this.newTimeS.end) {
                const event = {
                    start:this.newTimeS.start.replace('T', ' '),
                    end: this.newTimeS.end.replace('T', ' '),
                };
                this.selectedTimingsS = [event];
            }
        },
        searchServices() {
            let filteredServices = [...this.allservices] || [];
            if (this.searchQuery.trim()!=='') {
                filteredServices = filteredServices.filter(service =>
                service.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
            }
            
            if (this.mostRecentP) {
                const today = new Date();
                today.setHours(0,0,0,0);
                filteredServices=filteredServices.sort((a,b) => {
                    const dateA = new Date(a.start);
                    const dateB = new Date(b.start);
                    const diffA = Math.abs(today-dateA);
                    const diffB = Math.abs(today-dateB)
                    return diffA - diffB;
                });
            }

            if (this.selectedServiceTypesP.length > 0) {
                filteredServices = filteredServices.filter(service =>
                    service.serviceTypeReq.some(type=> this.selectedServiceTypesP.includes(type))
                );
            }
            return filteredServices;
        },
        searchJobs() {
            let filteredJobs = [...this.alljobs] || [];
            if (this.searchQueryS.trim()!=='') {
                filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(this.searchQueryS.toLowerCase()) ||
                job.name.toLowerCase().includes(this.searchQueryS.toLowerCase())
            );
            }
            
            if (this.mostRecentS) {
                const today = new Date();
                today.setHours(0,0,0,0);
                filteredJobs=filteredJobs.sort((a,b) => {
                    const dateA = new Date(a.start);
                    const dateB = new Date(b.start);
                    const diffA = Math.abs(today-dateA);
                    const diffB = Math.abs(today-dateB)
                    return diffA - diffB;
                })
            }

            if (this.selectedServiceTypesS.length > 0) {
                filteredJobs = filteredJobs.filter(job =>
                    job.serviceTypeReq.some(type=> this.selectedServiceTypesS.includes(type))
                );
            }
            return filteredJobs;
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        },
    },

       
    computed: {
        
        recommendServices() {
            const blockStart = new Date(this.newTimeP.start);
            const blockEnd = new Date(this.newTimeP.end);

            return this.allservices.filter(service => {
                const serviceStart = new Date(service.start);
                const serviceEnd = new Date(service.end);

                return (
                    (serviceStart >= blockStart && serviceStart <= blockEnd) || 
                    (serviceEnd >= blockStart && serviceEnd <= blockEnd) ||     
                    (serviceStart <= blockStart && serviceEnd >= blockEnd)      
                );
            });
        },
        recommendJobs() {
            const blockStart = new Date(this.newTimeS.start);
            const blockEnd = new Date(this.newTimeS.end);

            return this.alljobs.filter(job => {
                const jobStart = new Date(job.start);
                const jobEnd = new Date(job.end);

                return (
                    (jobStart >= blockStart && jobStart <= blockEnd) || 
                    (jobEnd >= blockStart && jobEnd <= blockEnd) ||     
                    (jobStart <= blockStart && jobEnd >= blockEnd)      
                );
            });
        },
    },
    
    components: {
    VueCal,
    },


}
</script>
<style>
    .ServiceNavBar {
        color: #ECDFCC;
        padding-left: 15px;
        background-color: inherit;
        border-top: 3px solid #f29040;
        margin-left:5px;
        margin-right:5px;
    }
    .PetOwner {
        display:inline-block;
        background-color:white;
        border-radius:50%;
        padding: 8px;
        z-index: 1;
        position:relative;
        right: 60px;
        bottom: 5px;
        border:3px solid #f29040;
        height:50%;
    }
    .ServiceProvider {
        display:inline-block;
        background-color:white;
        border-radius:50%;
        padding: 8px;
        z-index: 1;
        position:relative;
        right:23px;
        bottom:5px;
        border: 3px solid #f29040;
        height:50%;
    }
    .buttonBackground { 
        background-color:#fae1ae;
        display: inline-flex;
        z-index: 0;
        width: 60px;
        color:#fae1ae;
        border-radius:9999px;
        text-align:left;
        border: 1px solid #f2bc5c;
    }
    .snackbar {
        visibility: hidden;
        min-width: 250px;
        margin-left: -125px;
        background-color: #7c321b;
        color: #fae1ae;
        text-align: center;
        border-radius: 8px;
        padding: 16px;
        position: absolute;
        z-index: 9999;
        left: 50%;
        top: 80px;
        font-size: 17px;
        opacity: 0;
        transition: visibility 0.5s, opacity 0.5s ease-in-out;
    }

    .snackbar.show {
        visibility: visible;
        opacity: 1;
        position:fixed;
    }
    .swipe-right-enter-active,
    .swipe-right-leave-active {
    transition: transform 0.5s ease-in-out;
    }

    .swipe-right-enter,
    .swipe-right-leave-to {
    transform: translateX(100%); /* Start from the right */
    }

    .swipe-right-enter-to,
    .swipe-right-leave {
    transform: translateX(0); /* Slide in from the right */
    }

    /* Define the swipe-left transition (for moving backward) */
    .swipe-left-enter-active,
    .swipe-left-leave-active {
    transition: transform 0.5s ease-in-out;
    }

    .swipe-left-enter,
    .swipe-left-leave-to {
    transform: translateX(-100%); /* Start from the left */
    }

    .swipe-left-enter-to,
    .swipe-left-leave {
    transform: translateX(0); /* Slide in from the left */
    }
    .NotCurrent {
        color: #888585;
    }
    p {
        display:inline-block;
        padding-right: 20px;
        color: #7c321b;
        
    }
    .CurrentlyOwner {
        color: #7c321b;
    }
    .mainbody {
        border-top: 3px solid #f29040;
        color: #7c321b;
        width:99.5%;
        margin:auto;
    }
    .ServicePage {
        background-color: inherit;
    }
    .curPage {
        border-top: 3px solid #f29040;
        border-left: 3px solid #f29040;
        border-right: 3px solid #f29040;
        border-bottom: 3px solid #f29040;
        background-color: #f2bc5c;
        position:relative;
        height:51px;
        transition:  border-color 0.5s ease;
        color: white;
        
    }
    .calendar-container {
        margin-top: 20px; 
        overflow: visible;
    }
    .addIcon {
        border-color: #f29040;
        background-color:#242424;
        color: #242424;
        border-radius: 50%;
        margin-right: 10px;
        width:25px;
        height:80%;
    }
    .jobButton {
        border: 3px solid #f29040;
        border-radius: 15px;  
        justify-content: center;
        display:flex;
    }  
    .createJobForm {
        border: 3px solid #7c321b;
        border-radius: 15px; 
        padding: 20px;
        width:35%;
        align-content:center;
        box-shadow:10px 10px 5px  rgb(71, 71, 71);
        height:750px;
        overflow:auto;
    }
    
    .searchbar {
        padding-left: 10px;
        display:inline-block;
    }
    .filterbar {
        margin-left: 3%;
        display:inline-block;
    }
    .getRecommendations {
        margin-left:3%;
        display:inline-block;
        padding:10px;
    }
    .filteroption {
        margin-left: 20px;
    }
    .extrafilteroptions {
        display:inline-block;
        border: 2px solid #f29040;
        margin-left:10px;
        padding-right: 20px;
        border-radius:8px;
    }
    .FindServicesSearchBar{
        border-bottom: 3px solid #f29040;
    }
    .FindJobsSearchBar{
        border-bottom: 3px solid #f29040;
    }
    .cfmPopup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(0,0,0,0.5);
    }
    .popupContent {
        background-color: #fae1ae;
        padding: 20px;
        border-radius: 8px;
        text-align:center;
        border: 3px solid #7c321b;
        margin:auto;
        width:20%;
        z-index:9999;
    }
    .card-text {
        color: #ECDFCC;
        width: 100%;
        font-size:large !important;
    }
    .card-fixed {
        border-radius: 15px !important;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        height:600px !important;
        width:400px !important;
        padding:0px;
    }
    .card-body {
        max-height: calc(100% - 50px);
        overflow-y:auto;
    }
    .reloadButton {
        border-radius: 8px;
        border: solid 3px #f29040 ;
        position: absolute;
        margin-left: 1%;
        height: 40px;
    }
    .card-image {
        width:100%;
        height:200px;
        object-fit:cover;
        border-radius:8px;
        border: 2px solid #7c321b;
        margin: 0 auto;
        overflow:hidden;
    }
    .listing-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999; 
    }
    .listing-content {
        background-color: #ECDFCC;
        padding: 20px;
        width: 80%;
        height: 80%;
        overflow-y: auto;
        border-radius: 10px;
        text-align: center;
        position: relative;
        border: 5px solid #7c321b
    }
    input {
        background-color: #f2bc5c;
        border: 2px solid #7c321b;
    }
    .noAvailability {
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    color: #888585;
    text-align: center;
    font-size:x-large
    }
    .no-availability-image,
    .no-availability-text {
    margin: 0; 
    padding: 0; 
    text-align: center;
    }
    .no-availability-image {
    max-width: 10%;
    height: auto;
    }
    .custom-toggle:checked {
        background-color: #7c321b !important;
        border-color: #f29040 !important;
    }

    .custom-toggle-2:checked {
        background-color: #fae1ae !important;
        border-color: #f29040 !important;
    }

    .error {       /* Makes the span a block element */
    color: red;            /* Error message color */
    font-size: 12px;       /* Smaller font size */ 
    text-align:right;      /* Space between input field and error message */
    }
    
</style>
<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css" rel="stylesheet"> 
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <NavBar></NavBar>
    <div class="ServicePage">
    <div class="ServiceNavBar"> <!-- Nav Bar for service page-->
    <div class="row">
    <div class="col-md-12 col-12 col-lg-4" style="margin-top:12.5px !important;">
        <p :class="{CurrentlyOwner:isPetOwner,NotCurrent:!isPetOwner}"><strong>Pet Owner</strong></p>
            <div class="buttonBackground">#</div>
            <button @click="toggle(); showalert();getallservices();getalljobs();" :class="{PetOwner:isPetOwner, ServiceProvider:!isPetOwner}"></button>
        <p :class="{CurrentlyOwner:!isPetOwner,NotCurrent:isPetOwner}"><strong>Service Provider</strong></p>
    </div>
        <div v-if="isPetOwner" class="col-md-12 col-lg-8 col-12">
            <span>
                <button @click="currentPage = 'Find Services';checkpage(0);navigate('Find Services');getallservices();" :class="{curPage:iscurrentPage[0]}" style="display:inline-block" class="col-5 col-md-4"><strong>Find Services</strong></button>
                <button @click="currentPage = 'Post Jobs';checkpage(1);navigate('Post Jobs');getIndivEvents();" :class="{curPage:iscurrentPage[1]}" style="display:inline-block" class="col-3 col-md-4"><strong>Post Jobs</strong></button>
                <button @click="currentPage = 'Current Services';checkpage(2);navigate('Current Services');getmyongoingjobs();getmyjobs();getmypastjobs();" :class="{curPage:iscurrentPage[2]}" style="display:inline-block" class="col-4 col-md-4"><strong>My listings</strong></button>
            </span>
        </div>
        <div v-else-if="!isPetOwner" class="col-md-12 col-lg-8 col-12">
            <span>
                <button @click="currentPage = 'Find Jobs';checkpage(3);navigate('Find Jobs');getalljobs();" :class="{curPage:iscurrentPage[3]}" style="display:inline-block" class="col-3 col-md-4"><strong>Find Jobs</strong></button>
                <button @click="currentPage = 'Post Services';checkpage(4);navigate('Post Services');getIndivEventsService();" :class="{curPage:iscurrentPage[4]}" style="display:inline-block" class="col-5 col-md-4"><strong>Post Services</strong></button>
                <button @click="currentPage = 'Current Jobs';checkpage(5);navigate('Current Jobs');getmyongoingservices();getmyservices();getmypastservices();" :class="{curPage:iscurrentPage[5]}" style="display:inline-block" class="col-4 col-md-4"><strong>My listings</strong></button>
            </span>
        </div>
    </div>
    <div :class="['snackbar', { show: isalertVisible }]"><strong>You have changed to {{ alerttext }}</strong></div>
    </div>
    <div class="mainbody"> <!-- main page body-->
        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Find Services'"> <!--Pet Owner: Find Services-->
            <div class="MainServicesPage" v-if="currServicePage==='mainServicesPage'">
            <div class="FindServicesSearchBar container"> <!--Search button, filter button , get recommendation button-->
                <div class="searchbar row align-items-center">
                    <div class="col-auto">
                    <button @click="getallservices(),getmyongoingjobs()" style="margin-right:5px;border:3px solid #f29040;border-radius:8px;"><strong>Reload</strong></button>
                    </div>
                    <div class="getRecommendations col-auto">
                    <button style="border-radius:8px; border: 3px solid #f29040" @click="currServicePage = 'Recommendations Page'"><strong>Get Recommendations</strong></button>
                    </div>
                    <div class="col-12 col-lg-7 col-md-12">
                        <div class="input-group-search">
                            <input type="text" v-model="searchQuery" @input="searchServices()" placeholder="Search" id="searchP" style="border-radius:8px;" class="col-11 col-md-11 searchBar">
                        </div>
                    </div>
                    
                </div>
                <div class="filterbar mt-2 row">
                <label class="form-label col-3 col-sm-3 col-md-2 col-lg-2" style="font-size:large;">Filter by:</label>

                <!-- Most Recent Filter -->
                <div class="form-check form-switch col-4 col-sm-4 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle" v-model="mostRecentP" id="filterMostRecent"/>
                    <label class="form-check-label" for="filterMostRecent">Most Recent</label>
                </div>

                <!-- Service Types Filter -->
                <div class="form-check form-switch col-4 col-sm-4 col-md-3 col-lg-3" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" v-model="reqServiceTypeP" id="filterServiceTypes"/>
                    <label class="form-check-label" for="filterServiceTypes">Service Types</label>
                </div>

                <!-- Service Type Filters (Conditional) -->
                <div v-if="reqServiceTypeP" class="d-flex flex-wrap">
                    <div class="form-check form-switch mr-2 col-3 col-sm-2 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Sitter" v-model="selectedServiceTypesP" id="petSitter"/>
                    <label class="form-check-label" for="petSitter">Pet Sitter</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-3 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Walker" v-model="selectedServiceTypesP" id="petWalker"/>
                    <label class="form-check-label" for="petWalker">Pet Walker</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-3 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Groomer" v-model="selectedServiceTypesP" id="petGroomer"/>
                    <label class="form-check-label" for="petGroomer">Pet Groomer</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-2 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Trainer" v-model="selectedServiceTypesP" id="petTrainer"/>
                    <label class="form-check-label" for="petTrainer">Pet Trainer</label>
                    </div>
                </div>
                </div>
            </div>   
            </div>
            <div class="RecommendationsPage" v-else-if="currServicePage==='Recommendations Page'" > <!--when button 'Get Recommendations' is clicked-->
                <div>
                    <button @click="currServicePage = 'mainServicesPage'" style="background-color: #242424;"><img src="../../../public/img/arrow-121-16.png"> Go back</button>
                </div>
                <div class="row">
                <div class="calendar-container col-12 col-sm-12 col-md-12 col-lg-6">
                    <vue-cal class="calendar" style="height:750px"  
                    hide-title-bar
                    :events="selectedTimingsP"
                    :disable-views="['years']"
                    >
                    
                </vue-cal>
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-6" style="text-align:center">
                    <strong style="font-size:x-large">Input the time block u wish to search for services</strong><br>
                    <strong style="font-size:large">Start date & time:</strong><input type="datetime-local" name="Datetime" v-model="newTimeP.start" @input="updateTimeP()"><br>
                    <strong style="font-size:large">End date & time:</strong><input type="datetime-local" name="Datetime" v-model="newTimeP.end" @input="updateTimeP()"> <br>
                    <strong style="font-size:large">Recommended Services:</strong>
                    <div class="row">
                    <div v-for="service in recommendServices" :key="service.documentId" class="col-6 col-sm-6 col-md-6 col-lg-6">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="service.image" class="card-image" style="width:100%;height:auto"/>
                    <div class="card-body" style="margin-top:2px;; border-top: 3px solid #7c321b">
                        <h3><strong>{{ service.title }}</strong></h3>
                        <h5 style="text-align:center"><strong> {{ service.name }}</strong></h5>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong> {{ formatDate(service.start) }}<br><strong>To:</strong> {{ formatDate(service.end) }}</p>
                        <p class="card-text"><strong>Services Provided:</strong> <br> {{ service.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address: </strong>{{ service.address }}</p>
                        <p class="card-text"><strong>Contact Number: </strong>{{ service.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ service.payment }} / hour</p>
                        <p class="card-text"><strong>Skills & Experiences:</strong> <br> {{ service.skillsExp }}</p>
                        <button @click="ongoingService(service.documentId);getallservices();getmyongoingjobs()"><strong>Accept Service</strong></button>
                    </div>
                    </div>
                    </div>
                </div>
                </div>
                </div>
            </div> 
            <div v-if="currServicePage==='mainServicesPage'"> <!--Find Services (Service listings using cards)-->
                <div v-if="searchServices().length > 0">
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="service in searchServices()" :key="service.documentId" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="service.image" class="card-image" style="width:100%;height:auto"/>
                    <div class="card-body" style="margin-top:2px;; border-top: 3px solid #7c321b">
                        <h3><strong>{{ service.title }}</strong></h3>
                        <h5 style="text-align:center"><strong> {{ service.name }}</strong></h5>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong> {{ formatDate(service.start) }}<br><strong>To:</strong> {{ formatDate(service.end) }}</p>
                        <p class="card-text"><strong>Services Provided:</strong> <br> {{ service.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address: </strong>{{ service.address }}</p>
                        <p class="card-text"><strong>Contact Number: </strong>{{ service.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ service.payment }} / hour</p>
                        <p class="card-text"><strong>Skills & Experiences:</strong> <br> {{ service.skillsExp }}</p>
                        <button @click="ongoingService(service.documentId);getallservices();getmyongoingjobs();"><strong>Accept Service</strong></button>
                    </div>
                    </div>
                </div>
                </div>
                </div>
                <div v-else-if="searchQuery.trim()!==''" class="noAvailability">
                    No matching search found.
                </div>
                <div v-else-if="selectedServiceTypesP.length > 0 && searchServices.length === 0" class="noAvailability">
                    No services available for the selected job type.
                </div>
                <div v-if="allservices.length===0 && searchQuery.trim()==='' && selectedServiceTypesP.length===0" class="noAvailability">
                    <img src="/img/dogcaticon.png" style="max-width:10%;height:auto" class="no-availability-image col-12">
                    <p class="no-availabililty-text col-12" style="color:#888585">There are no services available now. Please come back another time!</p>
                </div>
            </div>
        </div>
        </transition>
        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Post Jobs'" class="postJob"> <!--Pet Owner: Post Job-->
            <div><button @click="getIndivEvents(),getmyjobs(),transferExpiredJob(),getmypastjobs()"class="reloadButton">Reload</button></div>
            
            <div class="calendar-container">
                <div class="row">
                <vue-cal class="calendar col-lg-6 col-md-12" style="height:750px"  
                hide-title-bar
                :events="jobevents"
                :disable-views="['years']"
                >
                    
                </vue-cal>
                <div v-if="!showButton" class="col-lg-6 col-md-12" style="display: flex; justify-content: center; align-items: center;">
                    <button v-if="!showButton" @click="showbutton();getUserInfo()" class="jobButton">
                        <span class="addIcon">## </span><span style="position: relative; right: 28px; bottom: 1px;color:white;">+</span>Create a new Job
                    </button>
                </div>

                <div class="col-lg-6 col-md-12" style="display: flex; justify-content: center; align-items: flex-start; margin-top:5px;">
                    <div v-if="showButton" class="createJobForm" style="width: 80%; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
                        <!-- Create a new job listing -->
                        <form @submit.prevent="showconfirmPopup()">
                            <h1 style="text-align:center; color: #7c321b !important;"><strong>New Job Listing</strong></h1>
                            <div style="border: 1.5px solid; margin-bottom: 10px;"></div>

                            <div class="input-group">
                                <label for="Name">Name:</label>
                                <input type="text" id="Name" name="Name" :value="PetOwnerName" class="input-field" readonly>
                            </div>
                            <div v-if="errorsP.name" class="error">{{ errorsP.name }}</div>

                            <div class="input-group">
                                <label for="Title">Title:</label>
                                <input type="text" id="Title" name="Title" v-model="newEvent.title" class="input-field" required>
                            </div>
                            <div v-if="errorsP.title" class="error">{{ errorsP.title }}</div>

                            <div style="padding-top: 15px;">
                                <label>Type of service needed:</label><br>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEvent.serviceTypeReq" value="Pet Sitter"> Pet Sitter
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEvent.serviceTypeReq" value="Pet Walker"> Pet Walker
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEvent.serviceTypeReq" value="Pet Groomer"> Pet Groomer
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEvent.serviceTypeReq" value="Pet Trainer"> Pet Trainer
                                </label>
                            </div>
                            <div v-if="errorsP.serviceTypeReq" class="error">{{ errorsP.serviceTypeReq }}</div>

                            <div style="padding-top: 15px;">
                                <label for="SpecialRequirements">Special Requirements:</label><br>
                                <textarea id="SpecialRequirements" name="SpecialRequirements" class="input-field" rows="5" v-model="newEvent.specialReq" style="background-color:#f2bc5c"></textarea>
                            </div>

                            <div class="input-group">
                                <label for="Address">Address:</label>
                                <input type="text" id="Address" name="Address" v-model="newEvent.address" class="input-field" required>
                            </div>
                            <div v-if="errorsP.address" class="error">{{ errorsP.address }}</div>

                            <div class="input-group">
                                <label for="Contact">Contact number:</label>
                                <input type="text" id="Contact" name="Contact" v-model="newEvent.contactNum" class="input-field" required>
                            </div>
                            <div v-if="errorsP.contactNum" class="error">{{ errorsP.contactNum }}</div>

                            <div class="input-group">
                                <label for="StartDate">Start Date & Time:</label>
                                <input type="datetime-local" id="StartDate" name="StartDate" v-model="newEvent.startDateTime" class="input-field" required>
                            </div>
                            <div v-if="errorsP.startDateTime" class="error">{{ errorsP.startDateTime }}</div>

                            <div class="input-group">
                                <label for="EndDate">End Date & Time:</label>
                                <input type="datetime-local" id="EndDate" name="EndDate" v-model="newEvent.endDateTime" class="input-field" required>
                            </div>
                            <div v-if="errorsP.endDateTime" class="error">{{ errorsP.endDateTime }}</div>

                            <div class="input-group">
                                <label for="Payment">Payment (/hr):</label>
                                <input type="text" id="Payment" name="Payment" v-model="newEvent.payment" class="input-field" required>
                            </div>
                            <div v-if="errorsP.payment" class="error">{{ errorsP.payment }}</div>

                            <button type="submit" class="submit-button" @click="validateFormP()">Create</button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <div v-if="confirmPopup" class="cfmPopup" style="display:flex;">
                <div class="popupContent col-4 col-sm-6 col-lg-4 col-md-5" > 
                    <p style="color:#7c321b; text-align:center;"> Would you like to submit?</p>
                    <div style="display:flex;">
                    <button type="submit" class="col-3" @click="showButton = false;confirmPopup=false;addJob();getIndivEvents();getmyjobs();getmypastjobs()" style="border-radius:8px; border: 3px solid #7c321b;">Yes</button>
                    <div class="col-6"></div>
                    <button class="col-3"@click="confirmPopup=false" style="border-radius:8px; border: 3px solid #7c321b;">No</button></div>
                </div>
            </div>
        </div>
        </transition>

        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Current Services'"> <!--Pet Owner: Current Services-->
            <div style="border-bottom: 3px solid #464545; padding-bottom: 10px;"> <!--All ongoing services-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">Ongoing listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in myongoingjobs" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto"/>
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Listing by:</strong> {{ event.name }} <br> <strong>Listing For:</strong> {{ event.linkedPerson }}</p> 
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.specialReq }}</p>
                        <button @click="viewMore(event)"><strong>View More</strong></button>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="myongoingjobs.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No ongoing listings available</strong>
                </div>
            </div>
            <div style="border-bottom: 3px solid #464545; padding-bottom: 10px;"> <!--All created, non expired job listings-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">My listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in myjobs" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3" >
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto;" />
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.specialReq }}</p>
                        <button @click="cancelJob(event.documentId);getmyjobs();getmypastjobs();getalljobs()">Cancel Listing</button>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="myjobs.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No listings</strong>
                </div>
            </div>

            <div> <!--Completed / Cancelled / Expired listings-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">Past listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in mypastjobs" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto;" />
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.specialReq }}</p>
                        <p class="card-text"><strong>Status: <br>{{ event.status }}</strong></p>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="mypastjobs.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No past listings</strong>
                </div>
            </div>
            <div v-if="showOngoingListing" class="listing-overlay"> <!--Full screen of selected ongoing listing-->
                <div class="listing-content">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <h3><strong>{{ selectedEvent.title }}</strong></h3>
                            </div>
                        </div> <br>
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <img :src="selectedEvent.image" style="max-width:300px;height:auto;" />
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-8" style="font-size:x-large">
                                <p><strong>Listing by:</strong> {{ selectedEvent.name }}</p>
                                <p><strong>Listing For:</strong> {{ selectedEvent.linkedPerson }}</p>
                                <p><strong>Period of service:</strong> {{ selectedEvent.start }} - {{ selectedEvent.end }}</p>
                                <p><strong>Services Required:</strong> {{ selectedEvent.serviceTypeReq.join(', ') }}</p>
                                <p><strong>Address:</strong> {{ selectedEvent.address }}</p>
                                <p><strong>Contact Number:</strong> {{ selectedEvent.contactNum }}</p>
                                <p><strong>Payment:</strong> ${{ selectedEvent.payment }} / hour</p>
                                <p><strong>Special Requirements:</strong> {{ selectedEvent.specialReq }}</p>
                                <p><strong>Skills & Experiences:</strong> {{ selectedEvent.skillsExp }}</p>
                                <p><strong>Status:</strong>{{ selectedEvent.status }}</p>
                                <div class="text-center">
                                    <button style="border:2px solid red;border-radius:8px;" class="m-2" @click="cancelOngoingJob(selectedEvent.documentId);closeListing();getmyongoingjobs();getmypastjobs()"><strong>Cancel</strong></button>
                                    
                                    <button style="border:2px solid green;border-radius:8px;" class="m-2" @click="completeOngoingService(selectedEvent.documentId);closeListing();getmyongoingjobs();getmypastjobs()"><strong>Complete</strong></button>
                                </div>
                                <div class="text-center mt-3">
                                    <button @click="closeListing()" class="close-btn" style="border:1px solid #f29040;border-radius:8px;"><strong>Close</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </transition>

        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Find Jobs'"> <!--Service Provider: Find Jobs-->
            <div class="MainJobsPage" v-if="currJobPage==='MainJobsPage'">
            <div class="FindJobsSearchBar container"> <!--Search button, filter button , get recommendation button-->
                <div class="searchbar row align-items-center">
                    <div class="col-auto">
                    <button @click="getalljobs(),getmyongoingservices()" style="margin-right:5px;border:3px solid #f29040;border-radius:8px;"><strong>Reload</strong></button>
                    </div>
                    <div class="getRecommendations col-auto">
                    <button style="border-radius:8px; border: 3px solid #f29040" @click="currJobPage = 'Recommendations Page'">Get Recommendations</button>
                    </div>
                    <div class="col-12 col-lg-7 col-md-12">
                        <div class="input-group">
                            <input type="text" v-model="searchQueryS" @input="searchJobs()" placeholder="Search" id="search" style="border-radius:8px;" class="col-11 col-md-11">
                        </div>
                    </div>
                </div>
                <div class="filterbar mt-2 row">
                <label class="form-label col-3 col-sm-3 col-md-2 col-lg-2" style="font-size:large;">Filter by:</label>

                <!-- Most Recent Filter -->
                <div class="form-check form-switch col-4 col-sm-4 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle" v-model="mostRecentS" id="filterMostRecentS"/>
                    <label class="form-check-label" for="filterMostRecentS">Most Recent</label>
                </div>

                <!-- Service Types Filter -->
                <div class="form-check form-switch col-4 col-sm-4 col-md-3 col-lg-3" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" v-model="reqServiceTypeS" id="filterServiceTypesS"/>
                    <label class="form-check-label" for="filterServiceTypesS">Service Types</label>
                </div>

                <!-- Service Type Filters (Conditional) -->
                <div v-if="reqServiceTypeS" class="d-flex flex-wrap">
                    <div class="form-check form-switch mr-2 col-3 col-sm-2 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Sitter" v-model="selectedServiceTypesS" id="petSitterS"/>
                    <label class="form-check-label" for="petSitterS">Pet Sitter</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-3 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Walker" v-model="selectedServiceTypesS" id="petWalkerS"/>
                    <label class="form-check-label" for="petWalkerS">Pet Walker</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-3 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Groomer" v-model="selectedServiceTypesS" id="petGroomerS"/>
                    <label class="form-check-label" for="petGroomerS">Pet Groomer</label>
                    </div>
                    <div class="form-check form-switch mr-2 col-3 col-sm-2 col-md-3 col-lg-2" style="font-size:large">
                    <input type="checkbox" class="form-check-input custom-toggle-2" value="Pet Trainer" v-model="selectedServiceTypesS" id="petTrainerS"/>
                    <label class="form-check-label" for="petTrainerS">Pet Trainer</label>
                    </div>
                </div> 
                </div>
                
            </div>   
            </div>
            <div class="RecommendationsPage" v-else-if="currJobPage==='Recommendations Page'" > <!--when button 'Get Recommendations' is clicked-->
                <div>
                    <button @click="currJobPage = 'MainJobsPage'"><img src="../../../public/img/arrow-121-16.png"> &nbsp;Go back</button>
                </div>
                <div class="row">
                <div class="calendar-container col-12 col-sm-12 col-md-12 col-lg-6">
                    <vue-cal class="calendar" style="height:750px"  
                    hide-title-bar
                    :events="selectedTimingsS"
                    :disable-views="['years']"
                    >
                    
                </vue-cal>
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-6">
                    <strong style="font-size:x-large">Input the time block u wish to search for jobs</strong><br>
                    <strong style="font-size:large">Start date & time:</strong><input type="datetime-local" name="Datetime" v-model="newTimeS.start" @input="updateTimeS()"><br>
                    <strong style="font-size:large">End date & time:</strong><input type="datetime-local" name="Datetime" v-model="newTimeS.end" @input="updateTimeS()"> <br>
                    <strong style="font-size:large">Recommended Jobs:</strong>
                    <div class="row">
                    <div v-for="job in recommendJobs" :key="job.documentId" class="col-6 col-sm-6 col-md-6 col-lg-6">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="job.image" class="card-image" style="width:100%;height:auto"/>
                    <div class="card-body" style="margin-top:2px; border-top: 3px solid #7c321b">
                        <h3><strong>{{ job.title }}</strong></h3>
                        <h5 style="text-align:center"><strong> {{ job.name }}</strong></h5>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong> {{ formatDate(job.start) }}<br><strong>To:</strong> {{ formatDate(job.end) }}</p>
                        <p class="card-text"><strong>Services needed: </strong><br> {{ job.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ job.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ job.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ job.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br> {{ job.specialReq }}</p>
                        <button @click="ongoingJob(job.documentId);getalljobs();getmyongoingservices();"><strong>Accept Job</strong></button>
                    </div>
                    </div>
                    </div>
                </div>
                </div>
                </div>
            </div> 
            <div v-if="currJobPage==='MainJobsPage'"> <!--Find Jobs (Service listings using cards)-->
                <div v-if="searchJobs().length > 0">
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="job in searchJobs()" :key="job.documentId" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="job.image" class="card-image" style="width:100%;height:auto;"/>
                    <div class="card-body" style="margin-top:2px;; border-top: 3px solid #7c321b">
                        <h3><strong>{{ job.title }}</strong></h3>
                        <h5 style="text-align:center"><strong>{{ job.name }}</strong></h5>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong> {{ formatDate(job.start) }}<br><strong>To:</strong> {{ formatDate(job.end) }}</p>
                        <p class="card-text"><strong>Services needed: </strong><br> {{ job.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ job.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ job.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ job.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br> {{ job.specialReq }}</p>
                        <button @click="ongoingJob(job.documentId);getalljobs();getmyongoingjobs()"><strong>Accept Job</strong></button>
                    </div>
                    </div>
                </div>
                </div>
                </div>
                <div v-else-if="searchQueryS.trim()!==''" class="noAvailability">
                    No matching search found.
                </div>
                <div v-else-if="selectedServiceTypesS.length > 0 && searchJobs().length === 0" class="noAvailability">
                    No jobs available for the selected job type.
                </div>
                <div v-if="alljobs.length === 0 && searchQueryS.trim()==='' && selectedServiceTypesS.length ===0" class="noAvailability">
                    <img src="/img/dogcaticon.png" style="max-width:10%;height:auto" class="no-availability-image col-12">
                    <p class="no-availabililty-text col-12"style="color:#888585;">There are no jobs available now. Please come back another time!</p>
                </div>
            </div>
        </div>
        </transition>

        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Post Services'"> <!--Service Provider: Post Services-->
            <div><button @click="getIndivEventsService(),getmyservices(),transferExpiredService(),getmypastservices()"class="reloadButton">Reload</button></div>
            
            <div class="calendar-container">
                <div class="row">
                <vue-cal class="calendar col-lg-6 col-md-12" style="height:750px"  
                hide-title-bar
                :events="serviceevents"
                :disable-views="['years']"
                >
                    
                </vue-cal>
                <div v-if="!showButton" class="col-lg-6 col-md-12" style="display: flex; justify-content: center; align-items: center;">
                    <button v-if="!showButton" @click="showbutton();getUserInfo()" class="jobButton">
                        <span class="addIcon">## </span><span style="position: relative; right: 28px; bottom: 1px;color:white;">+</span>Create a new Service
                    </button>
                </div>

                <div class="col-lg-6 col-md-12" style="display: flex; justify-content: center; align-items: flex-start;">
                    <div v-if="showButton" class="createJobForm" style="width: 80%; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
                        <!-- Create a new job listing -->
                        <form @submit.prevent="showconfirmPopup()">
                            <h1 style="text-align:center; color: #7c321b !important;"><strong>New Service Listing</strong></h1>
                            <div style="border: 1.5px solid #7c321b; margin-bottom: 10px;"></div>

                            <div class="input-group">
                                <label for="Name">Name:</label>
                                <input type="text" id="Name" name="Name" v-model="newEventService.name" class="input-field" readonly>
                            </div>
                            <div v-if="errorsS.name" class="error">{{ errorsS.name }}</div>

                            <div class="input-group">
                                <label for="Title">Title:</label>
                                <input type="text" id="Title" name="Title" v-model="newEventService.title" class="input-field" required>
                            </div>
                            <div v-if="errorsS.title" class="error">{{ errorsS.title }}</div>

                            <div style="padding-top: 15px;">
                                <label>Type of service you provide:</label><br>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEventService.serviceTypeReq" value="Pet Sitter"> Pet Sitter
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEventService.serviceTypeReq" value="Pet Walker"> Pet Walker
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEventService.serviceTypeReq" value="Pet Groomer"> Pet Groomer
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" name="ServiceCheckBox" v-model="newEventService.serviceTypeReq" value="Pet Trainer"> Pet Trainer
                                </label>
                            </div>
                            <div v-if="errorsS.serviceTypeReq" class="error">{{ errorsS.serviceTypeReq }}</div>

                            <div style="padding-top: 15px;">
                                <label for="SkillsExp">Skills & Past Experiences:</label><br>
                                <textarea id="SkillsExp" name="SkillsExp" class="input-field" rows="5" v-model="newEventService.skillsExp" style="background-color: #f2bc5c"></textarea>
                            </div>

                            <div class="input-group">
                                <label for="Address">Address:</label>
                                <input type="text" id="Address" name="Address" v-model="newEventService.address" class="input-field" required>
                            </div>
                            <div v-if="errorsS.address" class="error">{{ errorsS.address }}</div>

                            <div class="input-group">
                                <label for="Contact">Contact number:</label>
                                <input type="text" id="Contact" name="Contact" v-model="newEventService.contactNum" class="input-field" required>
                            </div>
                            <div v-if="errorsS.contactNum" class="error">{{ errorsS.contactNum }}</div>

                            <div class="input-group">
                                <label for="StartDate">Availability (start):</label>
                                <input type="datetime-local" id="StartDate" name="StartDate" v-model="newEventService.startDateTime" class="input-field" required>
                            </div>
                            <div v-if="errorsS.startDateTime" class="error">{{ errorsS.startDateTime }}</div>

                            <div class="input-group">
                                <label for="EndDate">Availability (end):</label>
                                <input type="datetime-local" id="EndDate" name="EndDate" v-model="newEventService.endDateTime" class="input-field" required>
                            </div>
                            <div v-if="errorsS.endDateTime" class="error">{{ errorsS.endDateTime }}</div>

                            <div class="input-group">
                                <label for="Payment">Rate (/hr):</label>
                                <input type="text" id="Payment" name="Payment" v-model="newEventService.payment" class="input-field" requried>
                            </div>
                            <div v-if="errorsS.payment" class="error">{{ errorsS.payment }}</div>

                            <button type="submit" class="submit-button" @click="validateFormS()">Create</button>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <div v-if="confirmPopup" class="cfmPopup" style="display:flex;">
                <div class="popupContent col-4 col-sm-6 col-lg-4 col-md-5"> 
                    <p style="color:#7c321b"> Would you like to submit?</p>
                    <div style="display:flex;">
                    <button type="submit" class="col-3" @click="showButton = false;confirmPopup=false;addService();getIndivEventsService();getmyservices();" style="border-radius:8px; border: 3px solid #7c321b;">Yes</button>
                    <div class="col-6"></div>
                    <button class="col-3"@click="confirmPopup=false" style="border-radius:8px; border: 3px solid #7c321b;">No</button></div>
                </div>
            </div>

        </div>
        </transition>

        <transition :name="transitionName" mode="out-in">
        <div v-if="currentPage === 'Current Jobs'"> <!--Service Provider: Current Jobs-->
            <div style="border-bottom: 3px solid #464545; padding-bottom: 10px;"> <!--All ongoing services-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">Ongoing listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in myongoingservices" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto"/>
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Listing by:</strong> {{ event.name }} <br> <strong>Listing For:</strong> {{ event.linkedPerson }}</p> 
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.specialReq }}</p>
                        <button @click="viewMore(event)"><strong>View More</strong></button>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="myongoingservices.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No ongoing listings available</strong>
                </div>
            </div>
            

            <div style="border-bottom: 3px solid #464545; padding-bottom: 10px;"> <!--All created, non expired service listings-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">My listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in myservices" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3" >
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto;" />
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.skillsExp }}</p>
                        <button @click="cancelService(event.documentId);getmyjobs();getmypastjobs();getalljobs()">Cancel Listing</button>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="myservices.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No listings</strong>
                </div>
            </div>

            <div> <!--Completed / Cancelled / Expired listings-->
                <h1 style="margin-top: 10px;margin-left:5px;"><strong style="font-size:xx-large">Past listings</strong></h1>
                <div class="row" style="margin-top:10px;padding-left:20px;padding-right:20px;">
                <div v-for="(event,index) in mypastservices" :key="index" class="col-12 col-sm-12 col-md-6 col-lg-3">
                    <div class="card card-fixed w-100" style="margin-top:5px;">
                    <img :src="event.image" class="card-image" style="width:100%;height:auto;" />
                    <div class="card-body" style="margin-top:2px; border-top:3px solid #7c321b">
                        <h3><strong>{{ event.title }}</strong></h3>
                        <p class="card-text"><strong>Period of service:</strong> <br><strong>From:</strong>{{ formatDate(event.start) }} <br><strong>To:</strong>{{ formatDate(event.end) }}</p>
                        <p class="card-text"><strong>Services Required:</strong><br>{{ event.serviceTypeReq.join(',') }}</p>
                        <p class="card-text"><strong>Address:</strong> {{ event.address }}</p>
                        <p class="card-text"><strong>Contact Number:</strong> {{ event.contactNum }}</p>
                        <p class="card-text"><strong>Payment:</strong> ${{ event.payment }} / hour</p>
                        <p class="card-text"><strong>Special Requirements:</strong> <br>{{ event.specialReq }}</p>
                        <p class="card-text"><strong>Status: <br>{{ event.status }}</strong></p>
                    </div>
                    </div>
                </div>
                </div>
                <div v-if="mypastservices.length === 0" class="noAvailability" style="height:200px !important;">
                <strong>No past listings</strong>
                </div>
            </div>

            <div v-if="showOngoingListing" class="listing-overlay"> <!--Full screen of selected ongoing listing-->
                <div class="listing-content">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <h3><strong>{{ selectedEvent.title }}</strong></h3>
                            </div>
                        </div> <br>
                        <div class="row justify-content-center">
                            <div class="col-12 text-center">
                                <img :src="selectedEvent.image" style="max-width:300px;height:auto;" />
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-12 col-md-8" style="font-size:x-large">
                                <p><strong>Listing by:</strong> {{ selectedEvent.name }}</p>
                                <p><strong>Listing For:</strong> {{ selectedEvent.linkedPerson }}</p>
                                <p><strong>Period of service:</strong> {{ selectedEvent.start }} - {{ selectedEvent.end }}</p>
                                <p><strong>Services Required:</strong> {{ selectedEvent.serviceTypeReq.join(', ') }}</p>
                                <p><strong>Address:</strong> {{ selectedEvent.address }}</p>
                                <p><strong>Contact Number:</strong> {{ selectedEvent.contactNum }}</p>
                                <p><strong>Payment:</strong> ${{ selectedEvent.payment }} / hour</p>
                                <p><strong>Special Requirements:</strong> {{ selectedEvent.specialReq }}</p>
                                <p><strong>Skills & Experiences:</strong> {{ selectedEvent.skillsExp }}</p>
                                <p><strong>Status:</strong>{{ selectedEvent.status }}</p>
                                <div class="text-center">
                                    <button style="border:2px solid red;border-radius:8px;" class="m-2" @click="cancelOngoingService(selectedEvent.documentId);closeListing();getmyongoingservices();getmypastservices();"><strong>Cancel</strong></button>
                                    <button style="border:2px solid green;border-radius:8px;" class="m-2" @click="completeOngoingService(selectedEvent.documentId);closeListing();getmyongoingservices();getmypastservices();"><strong>Complete</strong></button>
                                </div>
                                <div class="text-center mt-3">
                                    <button @click="closeListing()" class="close-btn" style="border:1px solid #f29040;border-radius:8px;"><strong>Close</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </transition>

    </div>
    </div>
    </template>

<style scoped>
/* Form styling */
.createJobForm {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Headings and Text */
h1 {
    font-family: 'Arial', sans-serif;
    color: #697565;
    font-size: 1.8rem;
    margin-bottom: 15px;
}

input[type="text"], input[type="datetime-local"], textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    margin: 8px 0;
    box-sizing: border-box;
}

/* Grouped input fields */
.input-group {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.input-group label {
    flex: 1;
    font-size: 1rem;
    color: #697565;
}

.input-group input {
    flex: 2;
    width: 70%;
}

/* Checkbox styling */
.checkbox-label {
    display: block;
    font-size: 1rem;
    margin-top: 10px;
}

/* Button styling */
.submit-button {
    width: 100%;
    padding: 12px;
    background-color: #697565;
    color: white;
    font-size: 1.2rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-button:hover {
    background-color: #5a6348;
}

.jobButton {
    padding: 10px 20px;
    background-color: #fae1ae;
    color: #3c3d37;
    border-radius: 10px;
    font-size: 1.2rem;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
}

.jobButton:hover {
    background-color: #f29040;
    color: white;
}
</style>