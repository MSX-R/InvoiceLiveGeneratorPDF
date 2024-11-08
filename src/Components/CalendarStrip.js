import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarStrip = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthTransitioning, setIsMonthTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(0);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const getDateRange = () => {
    const dates = [];
    const tempDate = new Date(currentDate);
    tempDate.setDate(tempDate.getDate() - 3);
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    return dates;
  };

  const changeMonth = (direction) => {
    setTransitionDirection(direction);
    setIsMonthTransitioning(true);
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setTimeout(() => setIsMonthTransitioning(false), 300);
  };

  const changeDay = (newDate) => {
    setCurrentDate(newDate);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-xl shadow-2xl">
      {/* Month Selection */}
      <div className="relative h-16 mb-6 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.div
          key={currentDate.getMonth()}
          initial={{ opacity: 0, x: transitionDirection * 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-center"
        >
          {months[currentDate.getMonth()]}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          onClick={() => changeMonth(1)}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Days Strip */}
      <div className="flex justify-between space-x-2">
        {getDateRange().map((date, index) => {
          const isSelected = date.getDate() === currentDate.getDate() &&
                           date.getMonth() === currentDate.getMonth();
          
          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 p-2 rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-cyan-500 text-white' 
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
              onClick={() => changeDay(date)}
            >
              <div className="text-sm mb-1">
                {daysOfWeek[date.getDay()]}
              </div>
              <div className={`text-xl font-bold ${
                isSelected ? 'text-white' : 'text-gray-100'
              }`}>
                {date.getDate()}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarStrip;