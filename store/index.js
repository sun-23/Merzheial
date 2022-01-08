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

