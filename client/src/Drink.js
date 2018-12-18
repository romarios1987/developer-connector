import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Drink = () => {
    return (
        <div>
            <FontAwesomeIcon icon="check-square" />
            Favorite Drink: <FontAwesomeIcon icon="coffee" size="6x" rotation={90} color="green" />
        </div>
    );
};
