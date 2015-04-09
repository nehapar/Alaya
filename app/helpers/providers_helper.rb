module ProvidersHelper
  # for an entry YYYY_MM_DD_ID_HH_MM
  # it return the ID of half hour before
  # 
  # For 2015_04_03_1_13_30, it returns 2015_04_03_1_13_00
  # For 2015_04_03_1_13_00, it returns 2015_04_03_1_12_30
  # 
  # @params: [id] the id of a cell to get the id of the cell before
  # 
  # @author: Thiago Melo
  # @version: 2015-03-21
  def prevTimeCellID(id)
    parts = id.split("_");
    minutes = (parts.pop).to_i
    hour = (parts.pop).to_i
    
    hour = minutes == 0 ? hour - 1 : hour
    hour = hour >= 10 ? hour.to_s : "0" + hour.to_s
    minutes = minutes == 0 ? 30 : 0
    minutes = minutes >= 10 ? minutes.to_s : "0" + minutes.to_s
    return parts.join("_") + "_" + hour + "_" + minutes
  end
  
  # for an entry YYYY_MM_DD_ID_HH_MM
  # it return the ID of half hour after
  # 
  # For 2015_04_03_1_13_30, it returns 2015_04_03_1_14_00
  # For 2015_04_03_1_13_00, it returns 2015_04_03_1_13_30
  # 
  # @params: [id] the id of a cell to get the id of the cell after
  # 
  # @author: Thiago Melo
  # @version: 2015-03-21
  def nextTimeCellID(id)
    parts = id.split("_");
    minutes = (parts.pop).to_i
    hour = (parts.pop).to_i
    hour = minutes == 0 ? hour : hour + 1
    hour = hour >= 10 ? hour.to_s : "0" + hour.to_s
    minutes = minutes == 0 ? 30 : 0
    minutes = minutes >= 10 ? minutes.to_s : "0" + minutes.to_s
    return parts.join("_") + "_" + hour + "_" + minutes
  end
end
