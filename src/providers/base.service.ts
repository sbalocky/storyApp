import { IDbEntity } from './../model/iDbEntity.model';
import { AngularFirestore, DocumentSnapshot, Action, DocumentReference } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, from } from 'rxjs';
import 'rxjs/add/observable/of';
import { of } from 'rxjs/observable/of';

export abstract class BaseService<T extends IDbEntity> {
  constructor(public fireStore: AngularFirestore, protected collectionName: string) {}
  public get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }
  getAllDocuments(): Observable<T[]> {
    return this.fireStore
      .collection<any>(this.collectionName)
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
      .collection<any>(this.collectionName)
      .doc(id)
      .snapshotChanges();
  }
  getDocument(id: string): Observable<T> {
    return from(
      this.fireStore
        .collection<any>(this.collectionName)
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
  // todo bug in typescript should be data: T
  insert<T>(data: any): Observable<DocumentReference> {
    return from(
      this.fireStore.collection(this.collectionName).add({
        ...data,
        updatedAt: this.timestamp,
        createdAt: this.timestamp
      })
    );
  }
  // todo bug in typescript should be data: T
  update<T>(data: any): Observable<void> {
    return from(
      this.fireStore
        .collection(this.collectionName)
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
        .collection(this.collectionName)
        .doc(id)
        .delete()
    );
  }
}
