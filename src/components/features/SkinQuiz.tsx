'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';

const skinTypes = [
  { id: 'dry', label: 'Dry Skin', desc: 'Needs deep moisture & barrier repair' },
  { id: 'oily', label: 'Oily Skin', desc: 'Prone to shine & clogged pores' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, normal/dry cheeks' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Easily irritated, needs calming care' },
];

const skinConcerns = [
  { id: 'hydration', label: 'Deep Hydration & Glow', product: 'Luxe Glow Serum', price: 2450, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600' },
  { id: 'aging', label: 'Fine Lines & Firmness', product: 'Hydrating Night Cream', price: 3100, image: 'https://images.unsplash.com/photo-1608248597260-1e523315a0c3?auto=format&fit=crop&q=80&w=600' },
  { id: 'radiance', label: 'Dullness & Brightening', product: 'Radiance Vitamin C Mist', price: 1850, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600' },
  { id: 'lips', label: 'Lip Softness & Care', product: 'Velvet Rose Lipstick', price: 1200, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600' },
];

export const SkinQuiz: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [selectedConcern, setSelectedConcern] = useState('');
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleReset = () => {
    setStep(1);
    setSelectedSkinType('');
    setSelectedConcern('');
    setAdded(false);
  };

  const recommendedProduct = skinConcerns.find((c) => c.id === selectedConcern) || skinConcerns[0];

  return (
    <section id="quiz" className="scroll-mt-20 py-20 bg-gradient-to-b from-white via-rose-50/40 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
            <Sparkles size={14} /> Interactive Routine Builder
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
            Find Your Ideal Skincare Routine
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Answer 2 quick questions and let our expert algorithm recommend the perfect match for your unique skin type.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-rose-100/80 p-6 sm:p-10 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : step === 2 ? '100%' : '100%' }}
            />
          </div>

          {/* Step 1: Skin Type */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 text-center">
                1. What is your primary skin type?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skinTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedSkinType(type.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      selectedSkinType === type.id
                        ? 'border-rose-500 bg-rose-50/70 shadow-md ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-rose-300 bg-white'
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-base">{type.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button
                  variant="primary"
                  disabled={!selectedSkinType}
                  onClick={() => setStep(2)}
                  className="gap-2 px-8 py-3"
                >
                  Next Step <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Skin Concern */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 text-center">
                2. What is your primary beauty concern?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skinConcerns.map((concern) => (
                  <button
                    key={concern.id}
                    type="button"
                    onClick={() => setSelectedConcern(concern.id)}
                    className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                      selectedConcern === concern.id
                        ? 'border-rose-500 bg-rose-50/70 shadow-md ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-rose-300 bg-white'
                    }`}
                  >
                    <p className="font-bold text-slate-900 text-base">{concern.label}</p>
                    <p className="text-xs text-rose-600 font-semibold mt-1">Recommended: {concern.product}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  ← Back
                </button>
                <Button
                  variant="primary"
                  disabled={!selectedConcern}
                  onClick={() => setStep(3)}
                  className="gap-2 px-8 py-3"
                >
                  View My Routine <Sparkles size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-xs uppercase tracking-wider text-rose-500 font-bold">Your Custom Prescription</span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Perfect Match Found!
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Based on your skin profile, our specialists recommend starting your regimen with this core product:
              </p>

              <div className="max-w-sm mx-auto mt-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm">
                <img
                  src={recommendedProduct.image}
                  alt={recommendedProduct.product}
                  className="w-20 h-20 object-cover rounded-xl shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{recommendedProduct.product}</h4>
                  <p className="text-xs text-rose-600 font-extrabold mt-1">
                    {recommendedProduct.price.toLocaleString('en-US')} ETB
                  </p>
                  <span className="inline-block mt-2 text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
                    Dermatologist Approved
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    addToCart({
                      id: recommendedProduct.id || 'quiz-1',
                      name: recommendedProduct.product,
                      category: 'Skincare',
                      price: recommendedProduct.price,
                      rating: 5.0,
                      reviewsCount: 150,
                      image: recommendedProduct.image,
                      description: 'Custom recommended product for your skin routine.',
                      isBestSeller: true,
                    });
                    setAdded(true);
                  }}
                  className="w-full sm:w-auto gap-2 px-8 py-3.5 shadow-lg shadow-rose-200"
                >
                  <ShoppingBag size={18} />
                  {added ? 'Added to Bag!' : 'Add Routine to Bag'}
                </Button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw size={16} /> Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};