using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;

namespace AdvertisingCompany.Web.Helpers
{
    public static class ImageHelpers
    {
        public static byte[] MakeThumbnail(byte[] myImage, int thumbWidth, int thumbHeight)
        {
            using (MemoryStream ms = new MemoryStream())
            using (Image image = Image.FromStream(new MemoryStream(myImage)))
            {
                Size thumbnailSize = GetThumbnailSize(image);
                var thumbnail = image.GetThumbnailImage(thumbnailSize.Width, thumbnailSize.Height, null, new IntPtr());
                thumbnail.Save(ms, ImageFormat.Jpeg);
                return ms.ToArray();
            }
        }

        public static Size GetThumbnailSize(Image original)
        {
            // Maximum size of any dimension.
            const int maxPixels = 1000;

            // Width and height.
            int originalWidth = original.Width;
            int originalHeight = original.Height;

            // Compute best factor to scale entire image based on larger dimension.
            double factor;
            if (originalWidth > originalHeight)
            {
                factor = (double)maxPixels / originalWidth;
            }
            else
            {
                factor = (double)maxPixels / originalHeight;
            }

            // Return thumbnail size.
            return new Size((int)(originalWidth * factor), (int)(originalHeight * factor));
        }
    }
}