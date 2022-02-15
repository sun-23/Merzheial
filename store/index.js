import { atom, selector } from "recoil";

// current day in microseconds with set hours, minutes, and seconds to 0
export const dayAtom = atom({
  key: 'day-atom',
  default: new Date().getSeconds
})


//=====patient =========================================================//
export const userInfoAtom = atom({
    key: 'user-infomation',
    default: {}
})

export const userListsAtom = atom({
    key: 'user-lists',
    default: []
})

export const listLastSevenDays = atom({
  key: 'lists-last-7-days',
  default: []
});

export const userListsDone = selector({
  key: 'lists-done',
  get: ({get}) => (get(userListsAtom).filter(e => e.isDone == true))
});

export const userListsNotDone = selector({
  key: 'lists-not-done',
  get: ({get}) => (get(userListsAtom).filter(e => e.isDone == false))
});

export const userMeetDocs = atom({
  key: 'users-meet-doctor',
  default: []
})

export const familyLists = atom({
  key: 'family-lists',
  default: []
})

//=====doctor and caretaker==========================================//

export const allPatientsAtom = atom({
  key: 'all-patients',
  default: []
})

export const currentPatientMeetDocs = atom({
  key: 'current-patient-meet-doctor',
  default: []
})

export const currentPatientTests = atom({
  key: 'current-patient-tests',
  default: []
})

export const sortcurrentPatientTests = selector({
  key: 'sort-current-patient-tests',
  get: ({get}) => {
      const temp = get(currentPatientTests)
      const lists = temp.filter(e => e) // create new array for fix attemped read only property
      return lists.sort((a,b) => {
        if (a && b) {
          return b.user_time.seconds - a.user_time.seconds
        }
        return 1
      })
    }
})