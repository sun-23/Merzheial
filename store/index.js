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

export const sortListsSelector = selector({
    key: 'sort-lists',
    get: ({get}) => {
      const temp = get(userListsAtom)
      const lists = temp.filter(e => e) // create new array for fix attemped read only property
      return lists.sort((a,b) => {
        if (a && b) {
          return a.day.seconds - b.day.seconds
        }
        return 1
      })
    }
})

export const listLastSevenDays = selector({
  key: 'lists-last-7-days',
  get: ({get}) => (get(sortListsSelector).filter(e => get(dayAtom) - e.day.seconds * 1000 >= 60 * 60 * 24 * 7))
});

export const listAfterCurrent = selector({
  key: 'lists-after-current-day',
  get: ({get}) => (get(sortListsSelector).filter(e => (e.day.seconds * 1000) - get(dayAtom) >= 0))
});

export const userListsDone = selector({
  key: 'lists-done',
  get: ({get}) => (get(listAfterCurrent).filter(e => e.isDone == true))
});

export const userListsNotDone = selector({
  key: 'lists-not-done',
  get: ({get}) => (get(listAfterCurrent).filter(e => e.isDone == false))
});

export const userMeetDocs = atom({
  key: 'users-meet-doctor',
  default: []
})

export const userSortMeetDocs = selector({
  key: 'sort-users-meet-doctor',
  get: ({get}) => {
      const temp = get(userMeetDocs)
      const lists = temp.filter(e => e) // create new array for fix attemped read only property
      return lists.sort((a,b) => {
        if (a && b) {
          return a.time.seconds - b.time.seconds
        }
        return 1
      })
    }
})

export const familyLists = atom({
  key: 'family-lists',
  default: []
})

//=====doctor=======================================================//

export const allPatientsAtom = atom({
  key: 'all-patients',
  default: []
})

export const currentPatientMeetDocs = atom({
  key: 'current-patient-meet-doctor',
  default: []
})

export const sortcurrentPatientMeetDocs = selector({
  key: 'sort-current-patient-meet-doctor',
  get: ({get}) => {
      const temp = get(currentPatientMeetDocs)
      const lists = temp.filter(e => e) // create new array for fix attemped read only property
      return lists.sort((a,b) => {
        if (a && b) {
          return b.time.seconds - a.time.seconds
        }
        return 1
      })
    }
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