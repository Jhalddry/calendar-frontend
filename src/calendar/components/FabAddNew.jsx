import React from 'react'

import { useCalendarStore, useUiStore } from '../../hooks'
import { addHours } from 'date-fns';

export const FabAddNew = () => {

    const { openDateModal } = useUiStore();
    const { setActiveEvent } = useCalendarStore();

    const handleClick = () => {
        setActiveEvent({
            title: '',
            notes: '',
            start: new Date(),
            end: addHours( new Date(), 2 ),
            bgColor: '#fafafa',
            user: {
                _id: '123',
                name: 'Jhalddry'
            }
        });
        openDateModal();
    }

  return (
    <button
      className="btn btn-primary fab"
      onClick={ handleClick }
    >
        <i className="fas fa-plus"></i>
    </button>
  )
}
