import { AngularFirestore, DocumentSnapshot, Action, DocumentReference } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs';

export abstract class BaseService<T> {
  constructor(public fireStore: AngularFirestore) {}
  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  getAllDocuments(): Observable<T[]> {
    Observable;
    return this.fireStore
      .collection<any>('storyCollection')
      .get({ source: 'server' })
      .pipe(
        switchMap(resp => {
          let resArray = new Array<T>();
          resp.forEach(res => {
            const data = res.data() as T;
            data['id'] = res.id;
            console.log(data);
            resArray.push(data);
          });
          return of(resArray);
        })
      );
  }
  watchDocument(id: string): Observable<Action<DocumentSnapshot<{}>>> {
    return this.fireStore
      .collection<any>('storyCollection')
      .doc(id)
      .snapshotChanges();
  }
  getDocument(id: string): Observable<T> {
    return from(
      this.fireStore
        .collection<any>('storyCollection')
        .doc(id)
        .ref.get()
    ).pipe(
      switchMap(d => {
        let doc = d.data() as T;
        doc['id'] = d.id;
        return of(doc);
      })
    );
  }
  insert<T>(data: any): Observable<DocumentReference> {
    // var newAppKey = this.fireStore.firestore.
    return from(
      this.fireStore.collection('storyCollection').add({
        // .doc(data.id)
        // .set({
        ...data,
        updatedAt: this.timestamp,
        createdAt: this.timestamp
      })
    );
  }
  update<T>(data: any): Observable<void> {
    return from(
      this.fireStore
        .collection('storyCollection')
        .doc(data.id)
        .update({
          ...data,
          updatedAt: this.timestamp
        })
    );
  }
  delete<T>(id: string): Observable<void> {
    return from(
      this.fireStore
        .collection('storyCollection')
        .doc(id)
        .delete()
    );
  }
}
