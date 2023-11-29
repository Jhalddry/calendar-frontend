import { useEffect, useMemo, useState } from 'react';

import ReactModal from 'react-modal';
import { addHours, differenceInSeconds } from 'date-fns';
import ReactDatePicker from 'react-datepicker';

import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";
import 'sweetalert2/dist/sweetalert2.min.css';

import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

ReactModal.setAppElement('#root')
export const CalendarModal = () => {

  const { isDateModalOpen, closeDateModal } = useUiStore();
const { activeEvent, startSavingEvent } = useCalendarStore();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues] = useState({
    title: 'Jhalddry',
    notes: 'Buy milk',
    start: new Date(),
    end: addHours( new Date(), 2 ),
  });

  const titleClass = useMemo(() => {
      if(!formSubmitted) return '';

      return ( formValues.title.length ) 
          ? '' 
          : 'is-invalid'

  }, [formValues.title, formSubmitted]);

  useEffect(() => {
      if ( activeEvent !== null ) {
          setFormValues({ ...activeEvent });
      }
  }, [activeEvent])

  const onInputChanged = ({ target }) => {
      setFormValues({
          ...formValues,
          [ target.name ]: target.value
      })
  };

  const onDateChanged = ( event, changing ) => {
      setFormValues({
          ...formValues,
          [ changing ]: event
      })
  }
  const onCloseModal = () => {
      closeDateModal();
  };

  const onSubmit = async(event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds( formValues.end, formValues.start );

    if ( isNaN( difference ) || difference <= 0 ){
        Swal.fire('Invalid date', 'Recheck your dates', 'error');
        return;
    }

    if ( formValues.title.length <= 0 ) return;

    console.log(formValues);

    //TODO:
    await startSavingEvent( formValues );
    closeDateModal();
    setFormSubmitted(false);
    //reset form
    //remove error in screen
  }

  return (
    <ReactModal
        isOpen={ isDateModalOpen }
        onRequestClose={ onCloseModal }
        style={ customStyles }
        className='modal'
        overlayClassName='modal-fondo'
        closeTimeoutMS={ 200 }
    >
        <h1> New Event </h1>
        <hr />
        <form className="container" onSubmit={ onSubmit }> 

            <div className="form-group mb-2">
                <label>Date and time start</label>
                <ReactDatePicker 
                    selected={ formValues.start }
                    onChange={ (event) => onDateChanged( event, 'start' ) }
                    className="form-control"
                    dateFormat="Pp"
                />
            </div>

            <div className="form-group mb-2">
                <label>Date and time end</label>
                <ReactDatePicker 
                    minDate={ formValues.start }
                    selected={ formValues.end }
                    onChange={ (event) => onDateChanged( event, 'end' ) }
                    className="form-control"
                    dateFormat="Pp"
                />
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Title and notes</label>
                <input 
                    type="text" 
                    className={`form-control ${ titleClass }`}
                    placeholder="Title of event"
                    name="title"
                    autoComplete="off"
                    value={ formValues.title }
                    onChange={ onInputChanged }
                />
                <small id="emailHelp" className="form-text text-muted">A short description</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notes"
                    rows="5"
                    name="notes"
                    autoComplete="off"
                    value={ formValues.notes }
                    onChange={ onInputChanged }
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Additional info</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span>Save</span>
            </button>

        </form>
    </ReactModal>
  )
}
