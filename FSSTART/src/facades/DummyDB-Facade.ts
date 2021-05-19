import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { IFriend } from '../interfaces/IFriend';

function singleValuePromise<T>(val: T | null): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    setTimeout(() => resolve(val), 0);
  })
}
//Generisk funktion


function arrayValuePromise<T>(val: Array<T>): Promise<Array<T>> { //Typen T er typen, der er, når funktionen kaldes. Fx IFriend eller null
  return new Promise<Array<T>>((resolve, reject) => {
    setTimeout(() => resolve(val), 0);
  })
}

class FriendsFacade {
  friends: Array<IFriend> = [
    { id: "id1", firstName: "Peter", lastName: "Pan", email: "pp@b.dk", password: "secret" },
    { id: "id2", firstName: "Donald", lastName: "Duck", email: "dd@b.dk", password: "secret" },
  ]


async addFriend(friend: IFriend): Promise<IFriend | null> {
    this.friends.push(friend);
      return singleValuePromise<IFriend>(friend);

    };
    
async updateFriend(friendId: string): Promise<IFriend | null> {
  let friend: IFriend | null
  friend = this.friends.find(f => f.id === friendId) || null;
    return singleValuePromise<IFriend>(friend);
    
}

async deleteFriend(friendEmail: string): Promise<IFriend | null> {
    let friend : IFriend | null
    friend = this.friends.find(f => f.email === friendEmail) || null;
    return singleValuePromise<IFriend>(friend);
  

    //throw new Error("Not Yet Implemented But return element deleted or null")
  }


  async getAllFriends(): Promise<Array<IFriend>> {
    const f: Array<IFriend> = this.friends;
    return arrayValuePromise<IFriend>(this.friends);  //laver et sekventielt svar om til et asynkront svar
  }
  async getFriend(friendEmail: string): Promise<IFriend | null> {
    let friend: IFriend | null
    friend = this.friends.find(f => f.email === friendEmail) || null;
    return singleValuePromise<IFriend>(friend);
  }
}

const facade = new FriendsFacade(); //ny instans betyder, at alle får samme instans, en singleton
export default facade;
