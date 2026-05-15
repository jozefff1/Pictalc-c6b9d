import { Metadata } from 'next';
import { CustomIconUpload } from '@/components/features/CustomIconUpload';

export const metadata: Metadata = {
  title: 'Custom Icons | Pictalk',
  description: 'Manage and upload custom AAC icons',
};

export default function CustomIconsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Custom Icons</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload your own images to use as AAC icons on the communication board.
          </p>
        </div>
      </div>

      <CustomIconUpload />
    </div>
  );
}
