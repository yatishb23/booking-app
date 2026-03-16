'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Event } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Ensure cn utility is available or remove if not

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'portrait';
  className?: string; // Added className prop
}

export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const availableTickets = event.capacity - event.ticketsSold;
  const soldPercentage = (event.ticketsSold / event.capacity) * 100;

  if (variant === 'portrait') {
    return (
      <Link href={`/events/${event.id}`} className="block h-full">
         <motion.div 
            whileHover={{ y: -5 }}
            className={cn("group cursor-pointer h-full flex flex-col gap-2 p-0 bg-transparent border-0 shadow-none", className)}
         >
           <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-muted/50 mb-1">
             <Image
                src={event.image || '/placeholder.svg'}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute top-2 right-2">
                 <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-background/90 backdrop-blur text-foreground font-medium shadow-sm">
                   {event.category}
                 </Badge>
             </div>
           </div>
           
           <div className="flex flex-col gap-0.5">
             <h3 className="font-bold text-base leading-tight text-foreground line-clamp-2">{event.title}</h3>
             <p className="text-xs text-muted-foreground font-medium">{event.category}</p>
           </div>
         </motion.div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/events/${event.id}`}>
        <motion.div 
           whileHover={{ y: -5 }}
           className={cn("flex gap-4 cursor-pointer hover:shadow-lg transition-all bg-card rounded-xl border p-4", className)}
        >
              <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  ${event.price}
                </Badge>
              </div>
        </motion.div>
      </Link>
    );
  }

  // Professional Minimalistic Card (Zomato/BookMyShow style)
  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn("group cursor-pointer h-full flex flex-col gap-3", className)}
      >
        {/* Image / Poster Container */}
        <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden rounded-xl bg-muted">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Rating Badge (Absolute like screenshot) */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-md">
             <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
             <span>4.8</span>
             <span className="text-white/70 ml-0.5">{(event.ticketsSold / 100).toFixed(1)}K Votes</span>
          </div>

           {/* Category Badge on top right */}
           <div className="absolute top-2 right-2">
             <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-black font-medium border-0 shadow-sm text-[10px] px-1.5 h-5">
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-1">
            <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground font-medium">
               <span>{event.category}</span>
               <span className="mx-1">•</span>
               <span>{event.location}</span>
            </div>

             <div className="flex items-center text-sm text-muted-foreground font-medium truncate">
                {/* Optional extra info line */}
             </div>
        </div>
      </motion.div>
    </Link>
  );
}

