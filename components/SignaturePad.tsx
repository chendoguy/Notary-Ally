
import React from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  signatureRef: React.RefObject<SignatureCanvas>;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ signatureRef }) => {
  return (
    <div className="bg-slate-200 dark:bg-slate-700 rounded-lg shadow-inner">
      <SignatureCanvas
        ref={signatureRef}
        penColor='black'
        canvasProps={{ className: 'w-full h-48 rounded-lg' }}
      />
    </div>
  );
};

export default SignaturePad;
