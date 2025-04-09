import React, { useEffect, useState } from 'react';
import { formatDate } from '../utils/utils';

const SpanCard = ({ data, position, setCardPosition }) => {
    const [cardPosition, setCardPositionState] = useState(position);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let x = e.clientX + 10; // Offset from cursor
            let y = e.clientY + 10;

            // Adjust horizontal position if needed
            if (x + 200 > viewportWidth) { // Assuming card width is 200px
                x = e.clientX - 200 - 10;
            }

            // Adjust vertical position if needed
            if (y + 200 > viewportHeight) { // Assuming card height is 200px
                y = e.clientY - 200 - 10;
            }

            setCardPositionState({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        setCardPosition(cardPosition);
    }, [cardPosition, setCardPosition]);

    return (
        <div
            className="fixed bg-white rounded-lg border p-4 shadow-lg max-w-xs z-50"
            style={{
                left: `${cardPosition.x}px`,
                top: `${cardPosition.y}px`
            }}
        >
            <div className="flex flex-col items-center">
                <img
                    src={data.foto}
                    alt={data.nome}
                    className="w-32 h-32 object-cover rounded-lg mb-2 border border-gray-200"
                />
                <h2 className='font-bold text-lg text-gray-900'>{data.nome}</h2>
                <div className="w-full mt-2">
                    <p className="text-sm"><span className="font-semibold">Graduação:</span> {data.faixa || 'N/A'}</p>
                    <p className="text-sm"><span className="font-semibold">Status:</span>
                        <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${data.ativo || data.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {data.ativo || data.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                    </p>
                    {data.data_nascimento && (
                        <p className="text-sm"><span className="font-semibold">Data de Nascimento:</span> {data.data_nascimento ? formatDate(data.data_nascimento) : 'N/A'}</p>
                    )}
                    <p className="text-sm"><span className="font-semibold">Contato:</span> {data.contato || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default SpanCard;