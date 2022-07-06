import { useState, useEffect } from 'react';
import './Records.css';
import RecordCard from './RecordCard.js';
import RecordForm from './RecordForm.js';

function Records() {

    const [records, setRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [scopedRecord, setScopedRecord] = useState({});
    const [error, setError] = useState();

    // code added to connect back end
    // will run on intitial load & re-render every time state changes
    useEffect( () => {
        fetch("http://localhost:8080/records")
        .then(response => response.json())
        .then(result => setRecords(result))
        .catch(console.log);
    }, []);


    function addClick() {
        const now = new Date();
        setScopedRecord({id:0, artist:"", album:"", year: now.getFullYear()});
        setShowForm(true)
    }

    function notify({ action, record, error }) {
        if (error) {
            setError(error);
            setShowForm(false);
            return;
        }
        // adds functionality to the delete button- fetches the delete route from api
        // see handleDelete function in RecordCard.js
        switch(action) {
            case "delete":
                setRecords(records.filter(r => r.id !== record.id));
                break;
            case "edit-form":
                setShowForm(true);
                setScopedRecord(record);   // once these run we will get an updated state and re-render
                return;
            case "edit":
                setRecords(records.map(r => {    // we are iterating through the whole array looking for the one record we are trying to update 
                                                if(r.id === record.id) { // else return original record if we didnt find the one we wanted to edit

                                                }
                                                return r; //  if the record we find matches the id of the one we are updating, return that                                                     }
                                             }
                                     )
                         )
                break;
            case "add":
                setRecords([...records, record]); // uses the spread operator to add a new record to existing records array
                break;
            default:
                console.log("Called notify with an invalid action.");
        }
        setError("");
        setShowForm(false);
    }

    if (showForm) {
        return <RecordForm record={scopedRecord} notify={notify} />
    }

    return (
        <>
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
                <h1 id='recordTitle'>Records</h1>
                <button className="btn btn-primary" type="button" onClick={addClick}>Add a Record</button>
                <table id='records'>
                    <tr>
                        <th>Artist</th>
                        <th>Album</th>
                        <th>Year</th>
                        <th>Actions</th>
                    </tr>
                    <tbody>
                        {records.map(r => <RecordCard key={r.recordId} record={r} notify={notify} />)}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Records;